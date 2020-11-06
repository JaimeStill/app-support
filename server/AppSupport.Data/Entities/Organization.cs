using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Organization
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public IEnumerable<Manifest> Manifests { get; set; }
        public IEnumerable<ManifestPerson> ManifestPeople { get; set; }
        public IEnumerable<Person> People { get; set; }
        public IEnumerable<Plane> Planes { get; set; }
        public IEnumerable<Template> Templates { get; set; }
    }
}