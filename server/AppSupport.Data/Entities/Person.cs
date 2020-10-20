using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Person
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public int RankId { get; set; }
        public int DodId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Nickname { get; set; }
        public string Occupation { get; set; }
        public string Ssn { get; set; }
        public string Title { get; set; }

        public Organization Organization { get; set; }
        public Rank Rank { get; set; }

        public virtual ICollection<ManifestPlanePerson> PersonManifestPlanes { get; set; }
        public virtual ICollection<TemplatePlanePerson> PersonTemplatePlanes { get; set; }
    }
}