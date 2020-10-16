using System;

namespace AppSupport.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public int? DefaultPageSize { get; set; }
        public Guid Guid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string SocketName { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsTech { get; set; }
    }
}