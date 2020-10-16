using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Rank
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public string Grade { get; set; }

        public virtual ICollection<Person> People { get; set; }
    }
}