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
    public static class BranchExtensions
    {
        static IQueryable<Branch> Search(this IQueryable<Branch> branches, string search) =>
            branches.Where(x => x.Name.ToLower().Contains(search.ToLower()));

        public static async Task<QueryResult<Branch>> QueryBranches(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Branch>(
                db.Branches,
                page, pageSize, search, sort
            );

            return await container.Query((people, s) => people.Search(s));
        }

        public static async Task<Branch> GetBranch(this AppDbContext db, int id) =>
            await db.Branches
                .FindAsync(id);

        public static async Task AddBranch(this AppDbContext db, Branch branch)
        {
            if (await branch.Validate(db))
            {
                await db.Branches.AddAsync(branch);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateBranch(this AppDbContext db, Branch branch)
        {
            if (await branch.Validate(db))
            {
                db.Branches.Update(branch);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveBranch(this AppDbContext db, Branch branch)
        {
            db.Branches.Remove(branch);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Branch branch, AppDbContext db)
        {
            if (string.IsNullOrEmpty(branch.Name))
            {
                throw new AppException("Branch must have a name", ExceptionType.Validation);
            }

            var check = await db.Branches
                .FirstOrDefaultAsync(x =>
                    x.Id != branch.Id &&
                    x.Name.ToLower() == branch.Name.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{branch.Name} is already a Branch", ExceptionType.Validation);
            }

            return true;
        }
    }
}