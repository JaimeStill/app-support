using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Person
    {
        public int Id { get; set; }
        public int? ExecutiveId { get; set; }
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

        public Person Executive { get; set; }
        public Organization Organization { get; set; }
        public Rank Rank { get; set; }

        public IEnumerable<Person> Associates { get; set; }
        public IEnumerable<ManifestPerson> ManifestPlanes { get; set; }
        public IEnumerable<TemplatePerson> TemplatePlanes { get; set; }
        public IEnumerable<ManifestPerson> Trips { get; set; }
    }
}