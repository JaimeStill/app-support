using System;
using System.Collections.Generic;

namespace AppSupport.Data.Entities
{
    public class Query
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Server { get; set; }
        public string Database { get; set; }
        public string Value { get; set; }
        public string EditorFont { get; set; }
        public int EditorFontSize { get; set; }
        public int EditorTabSpacing { get; set; }
    }
}