using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Manifest
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

        public IEnumerable<ManifestPlane> ManifestPlanes { get; set; }
    }
}