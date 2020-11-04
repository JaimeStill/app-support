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

        public static IQueryable<Template> Search(this IQueryable<Template> templates, string search) =>
            templates.Where(x => x.Title.ToLower().Contains(search.ToLower()));

        public static async Task<QueryResult<Template>> QueryTemplates(
            this AppDbContext db,
            int orgId,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Template>(
                db.Templates.Where(x => x.OrganizationId == orgId),
                page, pageSize, search, sort
            );

            return await container.Query((templates, s) => templates.Search(s));
        }

        static async Task<List<int>> GetTemplatePeopleIds(this AppDbContext db, int templateId) =>
            await db.TemplatePlanePeople
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
                    Reserved = x.TemplatePlanePeople.Count,
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
            var templatePlanePeople = db.TemplatePlanePeople
                .Where(x => x.TemplatePlane.TemplateId == templateId);

            db.TemplatePlanePeople.RemoveRange(templatePlanePeople);

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
        ) {
            var peopleIds = await db.GetTemplatePeopleIds(templateId);

            var container = new QueryContainer<Person>(
                db.People.SetIncludes().Where(x => !peopleIds.Contains(x.Id)),
                page, pageSize, search, sort
            );

            return await container.Query((people, s) => people.SetupSearch(s));
        }

        public static async Task<List<PersonModel>> GetTemplatePeople(this AppDbContext db, int templatePlaneId, string search = "") =>
            await db.TemplatePlanePeople
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

        public static async Task AddTemplatePlanePeople(this AppDbContext db, int templatePlaneId, List<Person> people)
        {
            var templatePlanePeople = people.Select(person => new TemplatePlanePerson
            {
                TemplatePlaneId = templatePlaneId,
                PersonId = person.Id
            });

            await db.TemplatePlanePeople.AddRangeAsync(templatePlanePeople);
            await db.SaveChangesAsync();
        }

        public static async Task RemoveTemplatePlanePerson(this AppDbContext db, TemplatePlanePerson templatePlanePerson)
        {
            db.TemplatePlanePeople.Remove(templatePlanePerson);
            await db.SaveChangesAsync();
        }

        static void RemoveTemplatePlanePeople(this AppDbContext db, int templateId)
        {
            var templatePlanePeople = db.TemplatePlanePeople
                .Where(x => x.TemplatePlane.TemplateId == templateId);

            db.TemplatePlanePeople.RemoveRange(templatePlanePeople);
        }

        #endregion
    }
}