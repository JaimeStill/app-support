using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using AppSupport.Core;
using AppSupport.Core.ApiQuery;
using AppSupport.Data.Entities;

namespace AppSupport.Data.Extensions
{
    public static class ManifestExtensions
    {
        static IQueryable<Manifest> Search(this IQueryable<Manifest> manifests, string search) =>
            manifests.Where(x => x.Title.ToLower().Contains(search.ToLower()));

        public static async Task<QueryResult<Manifest>> QueryManifests(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        )
        {
            var container = new QueryContainer<Manifest>(
                db.Manifests,
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
                db.Manifests.Update(manifest);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveManifest(this AppDbContext db, Manifest manifest)
        {
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
    }
}