using AppSupport.Core.Extensions;

namespace AppSupport.Office
{
    public class OfficeConfig
    {
        public string directory;

        public string Directory
        {
            get => directory;
            init
            {
                directory = value;
                Directory.EnsureDirectoryExists();
            }
        }
    }
}