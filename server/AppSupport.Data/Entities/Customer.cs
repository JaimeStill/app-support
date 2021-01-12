using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string EmailAddress { get; set; }
        public string Phone { get; set; }
    }
}