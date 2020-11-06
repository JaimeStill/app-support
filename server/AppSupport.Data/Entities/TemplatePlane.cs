using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class TemplatePlane
    {
        public int Id { get; set; }
        public int PlaneId { get; set; }
        public int TemplateId { get; set; }

        public Plane Plane { get; set; }
        public Template Template { get; set; }

        public virtual ICollection<TemplatePerson> TemplatePeople { get; set; }
    }
}