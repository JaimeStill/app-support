using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Template
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public Organization Organization { get; set; }

        public IEnumerable<TemplatePlane> TemplatePlanes { get; set; }
    }
}