using System.Collections.Generic;

namespace AppSupport.Core.Markdown
{
    public class Document
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public string Contents { get; set; }
        public string Extension { get; set; }
        public IEnumerable<string> Breadcrumbs { get; set; }
    }
}
