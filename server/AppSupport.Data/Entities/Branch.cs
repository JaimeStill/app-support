using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Branch
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public IEnumerable<Rank> Ranks { get; set; }
    }
}