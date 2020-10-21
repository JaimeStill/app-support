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
    public static class RankExtensions
    {
        static IQueryable<Rank> SetIncludes(this DbSet<Rank> ranks) =>
            ranks.Include(x => x.Branch);

        static IQueryable<Rank> Search(this IQueryable<Rank> ranks, string search) =>
            ranks.Where(x => x.Label.ToLower().Contains(search.ToLower()));

        public static async Task<QueryResult<Rank>> QueryRanks(
            this AppDbContext db,
            int branchId,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Rank>(
                db.Ranks.SetIncludes().Where(x => x.BranchId == branchId),
                page, pageSize, search, sort
            );

            return await container.Query((ranks, s) => ranks.Search(s));
        }

        public static async Task<Rank> GetRank(this AppDbContext db, int id) =>
            await db.Ranks
                .FindAsync(id);

        public static async Task AddRank(this AppDbContext db, Rank rank)
        {
            if (await rank.Validate(db))
            {
                await db.Ranks.AddAsync(rank);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdateRank(this AppDbContext db, Rank rank)
        {
            if (await rank.Validate(db))
            {
                db.Ranks.Update(rank);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemoveRank(this AppDbContext db, Rank rank)
        {
            db.Ranks.Remove(rank);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Rank rank, AppDbContext db)
        {
            if (string.IsNullOrEmpty(rank.Label))
            {
                throw new AppException("Rank must have a label", ExceptionType.Validation);
            }

            var check = await db.Ranks
                .FirstOrDefaultAsync(x =>
                    x.Id != rank.Id &&
                    x.Label.ToLower() == rank.Label.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{rank.Label} is already a Rank", ExceptionType.Validation);
            }

            return true;
        }
    }
}