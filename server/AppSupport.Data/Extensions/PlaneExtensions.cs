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
    public static class PlaneExtensions
    {
        static IQueryable<Plane> SetIncludes(this DbSet<Plane> planes) =>
            planes.Include(x => x.Organization);

        static IQueryable<Plane> Search(this IQueryable<Plane> planes, string search)
        {
            search = search.ToLower();

            return planes.Where(x =>
                x.Name.ToLower().Contains(search) ||
                x.Organization.Name.ToLower().Contains(search)
            );
        }

        static void ClearNavProps(this Plane plane) => plane.Organization = null;

        public static async Task<QueryResult<Plane>> QueryPlanes(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Plane>(
                db.Planes.SetIncludes(),
                page, pageSize, search, sort
            );

            return await container.Query((planes, s) => planes.Search(s));
        }

        public static async Task<Plane> GetPlane(this AppDbContext db, int id) =>
            await db.Planes
                .FindAsync(id);

        public static async Task<int> AddPlane(this AppDbContext db, Plane plane)
        {
            if (await plane.Validate(db))
            {
                await db.Planes.AddAsync(plane);
                await db.SaveChangesAsync();
                return plane.Id;
            }

            return 0;
        }

        public static async Task UpdatePlane(this AppDbContext db, Plane plane)
        {
            if (await plane.Validate(db))
            {
                plane.ClearNavProps();
                db.Planes.Update(plane);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemovePlane(this AppDbContext db, Plane plane)
        {
            db.Planes.Remove(plane);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Plane plane, AppDbContext db)
        {
            if (string.IsNullOrEmpty(plane.Name))
            {
                throw new AppException("Plane must have a name", ExceptionType.Validation);
            }

            var check = await db.Planes
                .FirstOrDefaultAsync(x =>
                    x.Id != plane.Id &&
                    x.Name.ToLower() == plane.Name.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{plane.Name} is already a Plane", ExceptionType.Validation);
            }

            return true;
        }
    }
}