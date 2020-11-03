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
    public static class TemplateExtensions
    {
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
    }
}