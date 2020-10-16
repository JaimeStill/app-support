using System.Collections.Generic;

namespace AppSupport.Core.Markdown
{
    public class Folder
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public bool HasReadme { get; set; }
        public IEnumerable<string> Breadcrumbs { get; set; }
        public IEnumerable<Document> Documents { get; set; }
        public IEnumerable<Folder> Folders { get; set; }
    }
}
