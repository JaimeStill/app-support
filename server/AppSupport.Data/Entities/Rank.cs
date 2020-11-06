using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Rank
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        public int Order { get; set; }
        public string Label { get; set; }
        public string Name { get; set; }
        public string Grade { get; set; }

        public Branch Branch { get; set; }

        public IEnumerable<ManifestPerson> ManifestPeople { get; set; }
        public IEnumerable<Person> People { get; set; }
    }
}