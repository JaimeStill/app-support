using AppSupport.Core.Extensions;

namespace AppSupport.Core.Office
{
    public class OfficeProvider
    {
        public string directory;

        public string Directory
        {
            get => directory;
            set
            {
                directory = value;
                Directory.EnsureDirectoryExists();
            }
        }
    }
}