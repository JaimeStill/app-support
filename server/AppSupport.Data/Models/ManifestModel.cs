using System;
using System.Collections.Generic;
using AppSupport.Data.Entities;

namespace AppSupport.Data.Models
{
    public class ManifestModel
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateExpected { get; set; }
        public DateTime? DateExecuted { get; set; }
        public bool IsClosed { get; set; }

        public Organization Organization { get; set; }

        public List<PlaneModel> Planes { get; set; }
    }
}