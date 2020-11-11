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
    public static class ManifestExtensions
    {
        #region Manifest

        static IQueryable<Manifest> SetIncludes(this DbSet<Manifest> manifests) =>
            manifests.Include(x => x.Organization);

        static IQueryable<Manifest> Search(this IQueryable<Manifest> manifests, string search)
        {
            search = search.ToLower();

            return manifests.Where(x =>
                x.Title.ToLower().Contains(search) ||
                x.Description.ToLower().Contains(search)
            );
        }

        public static async Task<QueryResult<Manifest>> QueryOpenManifests(
            this AppDbContext db,
            int orgId,
            string page,
            string pageSize,
            string search,
            string sort
        )
        {
            var container = new QueryContainer<Manifest>(
                db.Manifests
                    .SetIncludes()
                    .Where(x => x.OrganizationId == orgId && !x.IsClosed),
                page, pageSize, search, sort
            );

            return await container.Query((manifests, s) => manifests.Search(s));
        }

        public static async Task<QueryResult<Manifest>> QueryClosedManifests(
            this AppDbContext db,
            int orgId,
            string page,
            string pageSize,
            string search,
            string sort
        )
        {
            var container = new QueryContainer<Manifest>(
                db.Manifests
                    .SetIncludes()
                    .Where(x => x.OrganizationId == orgId && x.IsClosed),
                page, pageSize, search, sort
            );

            return await container.Query((manifests, s) => manifests.Search(s));
        }

        public static async Task<Manifest> GetManifest(this AppDbContext db, int id) =>
            await db.Manifests
                .FindAsync(id);

        public static async Task<int> GenerateManifest(this AppDbContext db, int templateId)
        {
            var template = await db.Templates
                .FindAsync(templateId);

            var manifest = new Manifest
            {
                DateCreated = DateTime.Now,
                DateExpected = DateTime.Now,
                DateUpdated = DateTime.Now,
                Description = template.Description,
                Title = template.Title,
                OrganizationId = template.OrganizationId,
                ManifestPlanes = db.TemplatePlanes
                    .Where(x => x.TemplateId == templateId)
                    .Select(plane => new ManifestPlane
                    {
                        PlaneId = plane.PlaneId,
                        ManifestPeople = db.TemplatePeople
                            .Where(x => x.TemplatePlaneId == plane.Id)
                            .Select(person => new ManifestPerson
                            {
                                Nickname = person.Person.Nickname,
                                LastName = person.Person.LastName,
                                FirstName = person.Person.FirstName,
                                MiddleName = person.Person.MiddleName,
                                Occupation = person.Person.Occupation,
                                OrganizationId = person.Person.OrganizationId,
                                PersonId = person.PersonId,
                                RankId = person.Person.RankId,
                                Title = person.Person.Title,
                                TravelerId = person.PersonId
                            })
                            .ToList()
                    })
                    .ToList()
            };

            await db.Manifests.AddAsync(manifest);
            await db.SaveChangesAsync();

            return manifest.Id;
        }

        public static async Task<int> AddManifest(this AppDbContext db, Manifest manifest)
        {
            if (await manifest.Validate(db))
            {
                manifest.DateCreated = DateTime.Now;
                manifest.DateUpdated = DateTime.Now;
                await db.Manifests.AddAsync(manifest);
                await db.SaveChangesAsync();

                return manifest.Id;
            }

            return 0;
        }

        public static async Task UpdateManifest(this AppDbContext db, Manifest manifest)
        {
            if (await manifest.Validate(db))
            {
                manifest.DateUpdated = DateTime.Now;
                db.Manifests.Update(manifest);
                await db.SaveChangesAsync();
            }
        }

        public static async Task ToggleManifestClosed(this AppDbContext db, Manifest manifest)
        {
            db.Manifests.Attach(manifest);
            manifest.DateUpdated = DateTime.Now;
            manifest.IsClosed = !manifest.IsClosed;
            await db.SaveChangesAsync();
        }

        public static async Task RemoveManifest(this AppDbContext db, Manifest manifest)
        {
            db.RemoveManifestPeople(manifest.Id);
            db.RemoveManifestPlanes(manifest.Id);
            db.Manifests.Remove(manifest);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Manifest manifest, AppDbContext db)
        {
            if (string.IsNullOrEmpty(manifest.Title))
            {
                throw new AppException("Manifest must have a title", ExceptionType.Validation);
            }

            var check = await db.Manifests
                .FirstOrDefaultAsync(x =>
                    x.Id != manifest.Id &&
                    x.Title.ToLower() == manifest.Title.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{manifest.Title} is already a Manifest", ExceptionType.Validation);
            }

            return true;
        }

        static async Task SetManifestUpdated(this AppDbContext db, int id)
        {
            var manifest = await db.Manifests
                    .FindAsync(id);
            db.Manifests.Attach(manifest);
            manifest.DateUpdated = DateTime.Now;
        }

        #endregion

        #region ManifestPlane

        public static async Task<List<Plane>> GetAvailableManifestPlanes(this AppDbContext db, int manifestId, int organizationId)
        {
            var planeIds = await db.ManifestPlanes
                .Where(x => x.ManifestId == manifestId)
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

        public static async Task<List<PlaneModel>> GetManifestPlanes(this AppDbContext db, int manifestId) =>
            await db.ManifestPlanes
                .Where(x => x.ManifestId == manifestId)
                .Select(x => new PlaneModel
                {
                    Id = x.PlaneId,
                    AltId = x.Id,
                    ParentId = x.ManifestId,
                    Capacity = x.Plane.Capacity,
                    Reserved = x.ManifestPeople.Count(),
                    Name = x.Plane.Name
                })
                .OrderBy(x => x.Name)
                .ToListAsync();

        public static async Task<List<PlaneModel>> GetManifestPlanesWithSpace(this AppDbContext db, int manifestId) =>
            await db.ManifestPlanes
                .Where(x =>
                    x.ManifestId == manifestId &&
                    x.ManifestPeople.Count() < x.Plane.Capacity
                )
                .Select(x => new PlaneModel
                {
                    Id = x.PlaneId,
                    AltId = x.Id,
                    ParentId = x.ManifestId,
                    Capacity = x.Plane.Capacity,
                    Reserved = x.ManifestPeople.Count(),
                    Name = x.Plane.Name
                })
                .OrderBy(x => x.Name)
                .ToListAsync();

        public static async Task AddManifestPlanes(this AppDbContext db, int manifestId, List<Plane> planes)
        {
            var manifestPlanes = planes.Select(plane => new ManifestPlane
            {
                ManifestId = manifestId,
                PlaneId = plane.Id
            });

            await db.SetManifestUpdated(manifestId);
            await db.ManifestPlanes.AddRangeAsync(manifestPlanes);
            await db.SaveChangesAsync();
        }

        public static async Task RemoveManifestPlane(this AppDbContext db, ManifestPlane manifestPlane)
        {
            db.RemoveManifestPlanePeople(manifestPlane.Id);
            db.ManifestPlanes.Remove(manifestPlane);

            await db.SetManifestUpdated(manifestPlane.ManifestId);
            await db.SaveChangesAsync();
        }

        static void RemoveManifestPlanes(this AppDbContext db, int manifestId)
        {
            var manifestPlanes = db.ManifestPlanes
                .Where(x => x.ManifestId == manifestId);

            db.ManifestPlanes.RemoveRange(manifestPlanes);
        }

        static int GetManifestIdFromPlaneId(this AppDbContext db, int id) =>
            db.ManifestPlanes
                .Find(id)
                .ManifestId;

        #endregion

        #region ManifestPerson

        static async Task<List<int>> GetManifestPeopleIds(this AppDbContext db, int manifestId) =>
            await db.ManifestPeople
                .Where(x => x.ManifestPlane.ManifestId == manifestId)
                .Select(x => x.PersonId)
                .ToListAsync();

        public static async Task<QueryResult<Person>> QueryAvailableManifestPeople(
            this AppDbContext db,
            int manifestId,
            string page,
            string pageSize,
            string search,
            string sort
        )
        {
            var peopleIds = await db.GetManifestPeopleIds(manifestId);

            var container = new QueryContainer<Person>(
                db.People.SetIncludes().Where(x => !peopleIds.Contains(x.Id) && !x.ExecutiveId.HasValue),
                page, pageSize, search, sort
            );

            return await container.Query((people, s) => people.SetupSearch(s));
        }

        public static async Task<List<PersonModel>> GetManifestPeople(this AppDbContext db, int manifestPlaneId, string search = "") =>
            await db.ManifestPeople
                .Include(x => x.Person)
                    .ThenInclude(x => x.Rank)
                        .ThenInclude(x => x.Branch)
                .Include(x => x.Person)
                    .ThenInclude(x => x.Organization)
                .Where(x =>
                    x.ManifestPlaneId == manifestPlaneId &&
                    (
                        x.Person.DodId.ToString().Contains(search) ||
                        x.Person.FirstName.ToLower().Contains(search) ||
                        x.Person.LastName.ToLower().Contains(search) ||
                        x.Person.MiddleName.ToLower().Contains(search) ||
                        x.Person.Ssn.Contains(search) ||
                        x.FirstName.ToLower().Contains(search) ||
                        x.LastName.ToLower().Contains(search) ||
                        x.MiddleName.ToLower().Contains(search) ||
                        x.Nickname.ToLower().Contains(search) ||
                        x.Occupation.ToLower().Contains(search) ||
                        x.Organization.Name.ToLower().Contains(search) ||
                        x.Rank.Grade.ToLower().Contains(search) ||
                        x.Rank.Label.ToLower().Contains(search) ||
                        x.Rank.Name.ToLower().Contains(search) ||
                        x.Rank.Branch.Name.ToLower().Contains(search) ||
                        x.Title.ToLower().Contains(search)
                    )
                )
                .Select(x => new PersonModel
                {
                    Id = x.PersonId,
                    AltId = x.Id,
                    ParentId = x.ManifestPlaneId,
                    OrganizationId = x.OrganizationId,
                    RankId = x.RankId,
                    TravelerId = x.TravelerId,
                    DodId = x.Person.DodId,
                    Ssn = x.Person.Ssn,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    MiddleName = x.MiddleName,
                    Nickname = x.Nickname,
                    Occupation = x.Occupation,
                    Title = x.Title,
                    Organization = x.Organization,
                    Rank = x.Rank
                })
                .OrderBy(x => x.LastName)
                .ToListAsync();

        public static async Task AddManifestPeople(this AppDbContext db, int manifestPlaneId, List<Person> people)
        {
            if (people.Validate())
            {
                var manifestPeople = people.Select(person => new ManifestPerson
                {
                    ManifestPlaneId = manifestPlaneId,
                    OrganizationId = person.OrganizationId,
                    PersonId = person.Id,
                    RankId = person.RankId,
                    TravelerId = person.Id,
                    FirstName = person.FirstName,
                    LastName = person.LastName,
                    MiddleName = person.MiddleName,
                    Nickname = person.Nickname,
                    Occupation = person.Occupation,
                    Title = person.Title
                });

                var manifestId = db.GetManifestIdFromPlaneId(manifestPlaneId);
                await db.SetManifestUpdated(manifestId);
                await db.ManifestPeople.AddRangeAsync(manifestPeople);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateManifestPerson(this AppDbContext db, ManifestPerson manifestPerson)
        {
            if (await manifestPerson.Validate(db))
            {
                var manifestId = db.GetManifestIdFromPlaneId(manifestPerson.ManifestPlaneId);
                await db.SetManifestUpdated(manifestId);
                db.ManifestPeople.Update(manifestPerson);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveManifestPerson(this AppDbContext db, ManifestPerson manifestPerson)
        {
            var manifestId = db.GetManifestIdFromPlaneId(manifestPerson.ManifestPlaneId);
            await db.SetManifestUpdated(manifestId);
            db.ManifestPeople.Remove(manifestPerson);
            await db.SaveChangesAsync();
        }

        static void RemoveManifestPlanePeople(this AppDbContext db, int manifestPlaneId)
        {
            var manifestPlanePeople = db.ManifestPeople
                .Where(x => x.ManifestPlaneId == manifestPlaneId);

            db.ManifestPeople.RemoveRange(manifestPlanePeople);
        }

        static void RemoveManifestPeople(this AppDbContext db, int manifestId)
        {
            var manifestPeople = db.ManifestPeople
                .Where(x => x.ManifestPlane.ManifestId == manifestId);

            db.ManifestPeople.RemoveRange(manifestPeople);
        }

        static bool Validate(this List<Person> people)
        {
            foreach (var person in people)
            {
                if (person.ExecutiveId.HasValue)
                {
                    throw new AppException("Cannot add an Associate to a Manifest", ExceptionType.Validation);
                }
            }

            return true;
        }

        static async Task<bool> Validate(this ManifestPerson manifestPerson, AppDbContext db)
        {
            var person = await db.People.FindAsync(manifestPerson.PersonId);

            if (person.ExecutiveId.HasValue)
            {
                throw new AppException("Cannot add an Associate to a Manifest", ExceptionType.Validation);
            }

            return true;
        }

        #endregion
    }
}