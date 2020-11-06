using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using AppSupport.Core;
using AppSupport.Core.ApiQuery;
using AppSupport.Data.Entities;
using AppSupport.Data.Models;

namespace AppSupport.Data.Extensions
{
    public static class TemplateExtensions
    {
        #region Template

        public static IQueryable<Template> SetIncludes(this DbSet<Template> templates) =>
            templates
                .Include(x => x.TemplatePlanes)
                    .ThenInclude(x => x.TemplatePeople)
                        .ThenInclude(x => x.Person)
                .Include(x => x.TemplatePlanes)
                    .ThenInclude(x => x.Plane);

        public static IQueryable<Template> Search(this IQueryable<Template> templates, string search) =>
            templates.Where(x =>
                x.Title.ToLower().Contains(search.ToLower()) ||
                x.TemplatePlanes.Any(tp => tp.Plane.Name.ToLower().Contains(search.ToLower())) ||
                x.TemplatePlanes.Any(tp =>
                    tp.TemplatePeople.Any(p =>
                        p.Person.LastName.ToLower().Contains(search.ToLower()) ||
                        p.Person.FirstName.ToLower().Contains(search.ToLower()) ||
                        p.Person.Ssn.ToLower().Contains(search.ToLower()) ||
                        p.Person.DodId.ToString().Contains(search.ToLower())
                    )
                )
            );

        public static async Task<QueryResult<Template>> QueryTemplates(
            this AppDbContext db,
            int orgId,
            string page,
            string pageSize,
            string search,
            string sort
        )
        {
            var container = new QueryContainer<Template>(
                db.Templates.SetIncludes().Where(x => x.OrganizationId == orgId),
                page, pageSize, search, sort
            );

            return await container.Query((templates, s) => templates.Search(s));
        }

        static async Task<List<int>> GetTemplatePeopleIds(this AppDbContext db, int templateId) =>
            await db.TemplatePeople
                .Where(x => x.TemplatePlane.TemplateId == templateId)
                .Select(x => x.PersonId)
                .ToListAsync();

        public static async Task<Template> GetTemplate(this AppDbContext db, int id) =>
            await db.Templates
                .FindAsync(id);

        public static async Task AddTemplate(this AppDbContext db, Template template)
        {
            if (await template.Validate(db))
            {
                await db.Templates.AddAsync(template);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateTemplate(this AppDbContext db, Template template)
        {
            if (await template.Validate(db))
            {
                db.Templates.Update(template);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveTemplate(this AppDbContext db, Template template)
        {
            db.RemoveTemplatePlanePeople(template.Id);
            db.RemoveTemplatePlanes(template.Id);
            db.Templates.Remove(template);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Template template, AppDbContext db)
        {
            if (string.IsNullOrEmpty(template.Title))
            {
                throw new AppException("Template must have a title", ExceptionType.Validation);
            }

            var check = await db.Templates
                .FirstOrDefaultAsync(x =>
                    x.Id != template.Id &&
                    x.Title.ToLower() == template.Title.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{template.Title} is already a Template", ExceptionType.Validation);
            }

            return true;
        }

        #endregion

        #region Template Planes

        public static async Task<List<Plane>> GetAvailableTemplatePlanes(this AppDbContext db, int templateId, int organizationId)
        {
            var planeIds = await db.TemplatePlanes
                .Where(x => x.TemplateId == templateId)
                .Select(x => x.PlaneId)
                .ToListAsync();

            return await db.Planes
                .Where(x =>
                    x.OrganizationId == organizationId &&
                    !planeIds.Contains(x.Id)
                )
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public static async Task<List<PlaneModel>> GetTemplatePlanes(this AppDbContext db, int templateId) =>
            await db.TemplatePlanes
                .Where(x => x.TemplateId == templateId)
                .Select(x => new PlaneModel
                {
                    Id = x.PlaneId,
                    AltId = x.Id,
                    ParentId = x.TemplateId,
                    Capacity = x.Plane.Capacity,
                    Reserved = x.TemplatePeople.Count,
                    Name = x.Plane.Name
                })
                .OrderBy(x => x.Name)
                .ToListAsync();

        public static async Task<List<PlaneModel>> GetTemplatePlanesWithSpace(this AppDbContext db, int templateId) =>
            await db.TemplatePlanes
                .Where(x =>
                    x.TemplateId == templateId &&
                    x.TemplatePeople.Count < x.Plane.Capacity
                )
                .Select(x => new PlaneModel
                {
                    Id = x.PlaneId,
                    AltId = x.Id,
                    ParentId = x.TemplateId,
                    Capacity = x.Plane.Capacity,
                    Reserved = x.TemplatePeople.Count,
                    Name = x.Plane.Name
                })
                .OrderBy(x => x.Name)
                .ToListAsync();

        public static async Task AddTemplatePlanes(this AppDbContext db, int templateId, List<Plane> planes)
        {
            var templatePlanes = planes.Select(plane => new TemplatePlane
            {
                TemplateId = templateId,
                PlaneId = plane.Id
            });

            await db.TemplatePlanes.AddRangeAsync(templatePlanes);
            await db.SaveChangesAsync();
        }

        public static async Task RemoveTemplatePlane(this AppDbContext db, TemplatePlane templatePlane)
        {
            db.RemoveTemplatePlanePeople(templatePlane.TemplateId);
            db.TemplatePlanes.Remove(templatePlane);
            await db.SaveChangesAsync();
        }

        static void RemoveTemplatePlanes(this AppDbContext db, int templateId)
        {
            var templatePeople = db.TemplatePeople
                .Where(x => x.TemplatePlane.TemplateId == templateId);

            db.TemplatePeople.RemoveRange(templatePeople);

            var templatePlanes = db.TemplatePlanes
                .Where(x => x.TemplateId == templateId);

            db.TemplatePlanes.RemoveRange(templatePlanes);
        }

        #endregion

        #region Template Plane People

        public static async Task<QueryResult<Person>> QueryAvailableTemplatePeople(
            this AppDbContext db,
            int templateId,
            string page,
            string pageSize,
            string search,
            string sort
        )
        {
            var peopleIds = await db.GetTemplatePeopleIds(templateId);

            var container = new QueryContainer<Person>(
                db.People.SetIncludes().Where(x => !peopleIds.Contains(x.Id) && !x.ExecutiveId.HasValue),
                page, pageSize, search, sort
            );

            return await container.Query((people, s) => people.SetupSearch(s));
        }

        public static async Task<List<PersonModel>> GetTemplatePeople(this AppDbContext db, int templatePlaneId, string search = "") =>
            await db.TemplatePeople
                .Include(x => x.Person)
                    .ThenInclude(x => x.Rank)
                        .ThenInclude(x => x.Branch)
                .Include(x => x.Person)
                    .ThenInclude(x => x.Organization)
                .Where(x =>
                    x.TemplatePlaneId == templatePlaneId &&
                    (
                        x.Person.DodId.ToString().Contains(search) ||
                        x.Person.FirstName.ToLower().Contains(search) ||
                        x.Person.LastName.ToLower().Contains(search) ||
                        x.Person.MiddleName.ToLower().Contains(search) ||
                        x.Person.Nickname.ToLower().Contains(search) ||
                        x.Person.Occupation.ToLower().Contains(search) ||
                        x.Person.Organization.Name.ToLower().Contains(search) ||
                        x.Person.Rank.Grade.ToLower().Contains(search) ||
                        x.Person.Rank.Label.ToLower().Contains(search) ||
                        x.Person.Rank.Name.ToLower().Contains(search) ||
                        x.Person.Rank.Branch.Name.ToLower().Contains(search) ||
                        x.Person.Ssn.Contains(search) ||
                        x.Person.Title.ToLower().Contains(search)
                    )
                )
                .Select(x => new PersonModel
                {
                    Id = x.PersonId,
                    AltId = x.Id,
                    ParentId = x.TemplatePlaneId,
                    OrganizationId = x.Person.OrganizationId,
                    RankId = x.Person.RankId,
                    DodId = x.Person.DodId,
                    FirstName = x.Person.FirstName,
                    LastName = x.Person.LastName,
                    MiddleName = x.Person.MiddleName,
                    Nickname = x.Person.Nickname,
                    Occupation = x.Person.Occupation,
                    Ssn = x.Person.Ssn,
                    Title = x.Person.Title,
                    Organization = x.Person.Organization,
                    Rank = x.Person.Rank
                })
                .OrderBy(x => x.LastName)
                .ToListAsync();

        public static async Task AddTemplatePeople(this AppDbContext db, int templatePlaneId, List<Person> people)
        {
            if (people.Validate())
            {
                var templatePeople = people.Select(person => new TemplatePerson
                {
                    TemplatePlaneId = templatePlaneId,
                    PersonId = person.Id
                });

                await db.TemplatePeople.AddRangeAsync(templatePeople);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateTemplatePerson(this AppDbContext db, TemplatePerson templatePerson)
        {
            if (await templatePerson.Validate(db))
            {
                db.TemplatePeople.Update(templatePerson);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveTemplatePerson(this AppDbContext db, TemplatePerson templatePerson)
        {
            db.TemplatePeople.Remove(templatePerson);
            await db.SaveChangesAsync();
        }

        static void RemoveTemplatePlanePeople(this AppDbContext db, int templateId)
        {
            var templatePeople = db.TemplatePeople
                .Where(x => x.TemplatePlane.TemplateId == templateId);

            db.TemplatePeople.RemoveRange(templatePeople);
        }

        static bool Validate(this List<Person> people)
        {
            foreach (var person in people)
            {
                if (person.ExecutiveId.HasValue)
                {
                    throw new AppException("Cannot add an Associate to a Template", ExceptionType.Validation);
                }
            }

            return true;
        }

        static async Task<bool> Validate(this TemplatePerson templatePerson, AppDbContext db)
        {
            var person = await db.People.FindAsync(templatePerson.PersonId);

            if (person.ExecutiveId.HasValue)
            {
                throw new AppException("Cannot add an Associate to a Template", ExceptionType.Validation);
            }

            return true;
        }


        #endregion
    }
}