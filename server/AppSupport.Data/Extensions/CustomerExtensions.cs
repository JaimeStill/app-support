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
    public static class CustomerExtensions
    {
        #region API

        public static IQueryable<Customer> SetupSearch(this IQueryable<Customer> customers, string search)
        {
            if (search.Contains('|'))
            {
                var searches = search.Split('|');

                foreach (var s in searches)
                {
                    customers = customers.Search(s.Trim());
                }

                return customers;
            }
            else
            {
                return customers.Search(search);
            }
        }

        static IQueryable<Customer> Search(this IQueryable<Customer> customers, string search)
        {
            search = search.ToLower();

            return customers.Where(x =>
                x.CompanyName.ToLower().Contains(search) ||
                x.EmailAddress.ToLower().Contains(search) ||
                x.FirstName.ToLower().Contains(search) ||
                x.LastName.ToLower().Contains(search) ||
                x.Phone.ToLower().Contains(search) ||
                x.Title.ToLower().Contains(search)
            );
        }

        public static async Task<QueryResult<Customer>> QueryCustomers(
            this AppDbContext db,
            string page,
            string pageSize,
            string search,
            string sort
        ) {
            var container = new QueryContainer<Customer>(
                db.Customers,
                page, pageSize, search, sort
            );

            return await container.Query((customers, s) => customers.SetupSearch(s));
        }

        public static async Task<Customer> GetCustomer(this AppDbContext db, int id) =>
            await db.Customers
                .FindAsync(id);

        public static async Task RemoveCustomer(this AppDbContext db, Customer customer)
        {
            db.Customers.Remove(customer);
            await db.SaveChangesAsync();
        }

        #endregion

        #region Migration
        public static async Task<bool> IsMigrated(this Customer customer, AppDbContext db)
        {
            var check = await db.Customers.FirstOrDefaultAsync(x => x.CustomerId.HasValue && x.CustomerId == customer.CustomerId);

            return check is not null;
        }

        public static async Task ImportCustomers(this AppDbContext db, List<Customer> customers)
        {
            foreach (var c in customers)
            {
                await db.ImportCustomer(c);
            }
        }

        public static async Task ImportCustomer(this AppDbContext db, Customer customer)
        {
            if (await customer.IsMigrated(db))
            {
                customer = await db.GetCustomer(customer);
                await db.UpdateCustomer(customer);
            }
            else
            {
                await db.AddCustomer(customer);
            }
        }

        static async Task<Customer> GetCustomer(this AppDbContext db, Customer customer) =>
            await db.Customers.FirstOrDefaultAsync(x => x.CustomerId.HasValue && customer.CustomerId == x.CustomerId);

        static async Task AddCustomer(this AppDbContext db, Customer customer)
        {
            await db.Customers.AddAsync(customer);
            await db.SaveChangesAsync();
        }

        static async Task UpdateCustomer(this AppDbContext db, Customer customer)
        {
            db.Customers.Update(customer);
            await db.SaveChangesAsync();
        }

        #endregion
    }
}