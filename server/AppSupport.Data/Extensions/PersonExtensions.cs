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
    class SplitEqualityComparer : IEqualityComparer<string>
    {
        public bool Equals(string s1, string s2)
        {
            var values = s1.Split('|');

            foreach (var v in values)
            {
                if (s2.ToLower().Contains(v.ToLower()))
                    return true;
            }

            return false;
        }

        public int GetHashCode(string s) => s.GetHashCode();
    }

    public static class PersonExtensions
    {
        static IQueryable<Person> SetIncludes(this DbSet<Person> people) =>
            people
                .Include(x => x.Organization)
                .Include(x => x.Rank)
                    .ThenInclude(x => x.Branch);

        static IQueryable<Person> SetupSearch(this IQueryable<Person> people, string search)
        {
            if (search.Contains('|'))
            {
                var searches = search.Split('|');

                foreach (var s in searches)
                {
                    people = people.Search(s.Trim());
                }

                return people;
            }
            else
            {
                return people.Search(search);
            }
        }

        static IQueryable<Person> Search(this IQueryable<Person> people, string search)
        {
            search = search.ToLower();

            return people.Where(x =>
                x.DodId.ToString().Contains(search) ||
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
                x.Ssn.Contains(search) ||
                x.Title.ToLower().Contains(search)
            );
        }

        public static async Task<QueryResult<Person>> QueryPeople(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Person>(
                db.People.SetIncludes(),
                page, pageSize, search, sort
            );

            return await container.Query((people, s) => people.SetupSearch(s));
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