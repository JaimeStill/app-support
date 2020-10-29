using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using AppSupport.Core;
using AppSupport.Core.ApiQuery;
using AppSupport.Data.Entities;

namespace AppSupport.Data.Extensions
{
    public static class OrganizationExtensions
    {
        static IQueryable<Organization> Search(this IQueryable<Organization> orgs, string search) =>
            orgs.Where(x => x.Name.ToLower().Contains(search.ToLower()));

        public static async Task<QueryResult<Organization>> QueryOrganizations(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Organization>(
                db.Organizations,
                page, pageSize, search, sort
            );

            return await container.Query((orgs, s) => orgs.Search(s));
        }

        public static async Task<List<Organization>> GetOrganizations(this AppDbContext db) =>
            await db.Organizations
                .OrderBy(x => x.Name)
                .ToListAsync();
        public static async Task<Organization> GetOrganization(this AppDbContext db, int id) =>
            await db.Organizations
                .FindAsync(id);

        public static async Task AddOrganization(this AppDbContext db, Organization org)
        {
            if (await org.Validate(db))
            {
                await db.Organizations.AddAsync(org);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateOrganization(this AppDbContext db, Organization org)
        {
            if (await org.Validate(db))
            {
                db.Organizations.Update(org);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveOrganization(this AppDbContext db, Organization org)
        {
            db.Organizations.Remove(org);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Organization org, AppDbContext db)
        {
            if (string.IsNullOrEmpty(org.Name))
            {
                throw new AppException("Organization must have a name", ExceptionType.Validation);
            }

            var check = await db.Organizations
                .FirstOrDefaultAsync(x =>
                    x.Id != org.Id &&
                    x.Name.ToLower() == org.Name.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{org.Name} is already an Organization", ExceptionType.Validation);
            }

            return true;
        }
    }
}