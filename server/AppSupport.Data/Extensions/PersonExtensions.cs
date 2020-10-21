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
    public static class PersonExtensions
    {
        static IQueryable<Person> Search(this IQueryable<Person> people, string search) =>
            people.Where(x => x.FirstName.ToLower().Contains(search.ToLower()));

        public static async Task<QueryResult<Person>> QueryPeople(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Person>(
                db.People,
                page, pageSize, search, sort
            );

            return await container.Query((people, s) => people.Search(s));
        }

        public static async Task<Person> GetPerson(this AppDbContext db, int id) =>
            await db.People
                .FindAsync(id);

        public static async Task AddPerson(this AppDbContext db, Person person)
        {
            if (await person.Validate(db))
            {
                await db.People.AddAsync(person);
                await db.SaveChangesAsync();
            }
        }

        public static async Task UpdatePerson(this AppDbContext db, Person person)
        {
            if (await person.Validate(db))
            {
                db.People.Update(person);
                await db.SaveChangesAsync();
            }
        }

        public static async Task RemovePerson(this AppDbContext db, Person person)
        {
            db.People.Remove(person);
            await db.SaveChangesAsync();
        }

        static async Task<bool> Validate(this Person person, AppDbContext db)
        {
            if (string.IsNullOrEmpty(person.FirstName))
            {
                throw new AppException("Person must have a first name", ExceptionType.Validation);
            }

            var check = await db.People
                .FirstOrDefaultAsync(x =>
                    x.Id != person.Id &&
                    x.FirstName.ToLower() == person.FirstName.ToLower()
                );

            if (check != null)
            {
                throw new AppException($"{person.FirstName} is already a Person", ExceptionType.Validation);
            }

            return true;
        }
    }
}