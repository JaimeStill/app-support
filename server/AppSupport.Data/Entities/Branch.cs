using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Branch
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Rank> Ranks { get; set; }
    }
}