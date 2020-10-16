using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class ManifestPlane
    {
        public int Id { get; set; }
        public int ManifestId { get; set; }
        public int PlaneId { get; set; }

        public Manifest Manifest { get; set; }
        public Plane Plane { get; set; }

        public virtual ICollection<ManifestPlanePerson> ManifestPlanePeople { get; set; }
    }
}