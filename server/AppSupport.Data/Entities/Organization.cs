using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Organization
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Manifest> Manifests { get; set; }
        public virtual ICollection<Person> People { get; set; }
        public virtual ICollection<Plane> Planes { get; set; }
        public virtual ICollection<Template> Templates { get; set; }
    }
}