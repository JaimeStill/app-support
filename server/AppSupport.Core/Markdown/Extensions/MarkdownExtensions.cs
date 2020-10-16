using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AppSupport.Core.Markdown.Extensions
{
    public static class MarkdownExtensions
    {
        public static string GetDirectoryPath(this string path, bool isFile, char splitChar = '/', string pattern = "*.md")
        {
            var split = path.Split(splitChar);

            if (split.Length > (isFile ? 1 : 0))
            {
                var check = split[split.Length - 1].ToLower().EndsWith(pattern.Substring(1).ToLower())
                    ? path.Substring(0, (path.Length - 1) - split[split.Length - 1].Length)
                    : path;

                return check;
            }
            else
            {
                return null;
            }
        }

        static IEnumerable<string> Validate(this IEnumerable<string> breadcrumbs) =>
            breadcrumbs == null || breadcrumbs.Count() < 1
                ? new List<string>()
                : breadcrumbs;

        static bool CheckReadme(this DirectoryInfo directory) => directory.GetFiles("readme.md", new EnumerationOptions
        {
            MatchCasing = MatchCasing.CaseInsensitive,
            RecurseSubdirectories = false,
            ReturnSpecialDirectories = false
        }).Length > 0;

        public static Folder GetFolder(this string path, IEnumerable<string> breadcrumbs, bool isStart = true, string pattern = "*.md")
        {
            var check = path.GetDirectoryPath(false, '\\', pattern);

            if (Directory.Exists(check))
            {
                var directory = new DirectoryInfo(check);

                if (!isStart)
                    breadcrumbs = breadcrumbs.Validate()
                                             .Append(directory.Name);

                var folder = new Folder
                {
                    Breadcrumbs = breadcrumbs,
                    Name = directory.Name,
                    Path = directory.FullName,
                    HasReadme = directory.CheckReadme(),
                    Documents = directory.GetFiles(pattern)
                        .Select(x => new Document
                        {
                            Breadcrumbs = breadcrumbs.Validate(),
                            Extension = x.Extension,
                            Name = x.Name,
                            Path = x.FullName
                        })
                };

                var folders = new List<Folder>();

                foreach (var dir in directory.GetDirectories())
                {
                    var sub = dir.FullName.GetFolder(folder.Breadcrumbs, false);

                    if ((sub.Documents != null && sub.Documents.Count() > 0) || (sub.Folders != null && sub.Folders.Count() > 0))
                    {
                        folders.Add(sub);
                    }
                }

                folder.Folders = folders.Count > 0 ? folders : null;

                return folder;
            }

            return null;
        }

        public static async Task<Document> GetDocument(this string path)
        {
            if (File.Exists(path))
            {
                var file = new FileInfo(path);
                var crumbs = file.Name.GetDirectoryPath(true, '\\');

                return new Document
                {
                    Breadcrumbs = crumbs == null ? null : crumbs.Split('\\'),
                    Extension = file.Extension,
                    Name = file.Name,
                    Path = file.FullName,
                    Contents = await File.ReadAllTextAsync(path)
                };
            }

            return null;
        }
    }
}
