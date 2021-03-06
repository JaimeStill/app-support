using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Plane
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public int Capacity { get; set; }
        public string Name { get; set; }

        public Organization Organization { get; set; }

        public IEnumerable<ManifestPlane> PlaneManifests { get; set; }
        public IEnumerable<TemplatePlane> PlaneTemplates { get; set; }
    }
}