using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using AppSupport.Core;
using AppSupport.Core.Extensions;
using AppSupport.Data.Entities;

namespace AppSupport.Data.Extensions
{
    public static class QueryExtensions
    {
        public static void SetDefaultQueryValues(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Query>()
                .Property<int>(query => query.EditorFontSize)
                .HasDefaultValue(14);

            modelBuilder.Entity<Query>()
                .Property<int>(query => query.EditorTabSpacing)
                .HasDefaultValue(2);

            modelBuilder.Entity<Query>()
                .Property<string>(query => query.EditorFont)
                .HasDefaultValue("Cascadia Code");

            modelBuilder.Entity<Query>()
                .Property<string>(query => query.Server)
                .HasDefaultValue(@".\DevSql");

            modelBuilder.Entity<Query>()
                .Property<string>(query => query.Database)
                .HasDefaultValue("AdventureWorksLT2019");
        }

        public static async Task<List<Query>> GetQueries(this AppDbContext db) => await db.Queries.OrderBy(x => x.Name).ToListAsync();

        public static async Task<Query> GetQuery(this AppDbContext db, string name) => await db.Queries.FirstOrDefaultAsync(x => x.Name == name.UrlEncode());

        public static async Task<bool> ValidateQueryName(this AppDbContext db, Query query)
        {
            var check = await db.Queries
                .FirstOrDefaultAsync(x =>
                    x.Id != query.Id &&
                    x.Name == query.Name.UrlEncode()
                );

            return check is null;
        }

        public static async Task<Query> AddQuery(this AppDbContext db, Query query)
        {
            if (await query.Validate(db))
            {
                query.Name = query.Name.UrlEncode();

                await db.Queries.AddAsync(query);
                await db.SaveChangesAsync();

                return query;
            }

            return null;
        }

        public static async Task<Query> UpdateQuery(this AppDbContext db, Query query)
        {
            if (await query.Validate(db))
            {
                db.Queries.Update(query);
                await db.SaveChangesAsync();

                return query;
            }

            return null;
        }

        public static async Task RemoveQuery(this AppDbContext db, Query query)
        {
            db.Queries.Remove(query);
            await db.SaveChangesAsync();
        }

        public static async Task<bool> Validate(this Query query, AppDbContext db)
        {
            if (await db.ValidateQueryName(query) is false)
            {
                throw new AppException($"{query.Name} already exists", ExceptionType.Validation);
            }

            return true;
        }
    }
}