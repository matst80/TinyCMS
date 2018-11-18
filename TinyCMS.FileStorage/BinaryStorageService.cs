using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using TinyCMS.Interfaces;
using TinyCMS.Storage;

namespace TinyCMS.FileStorage
{
    public class BinaryStorageService : IStorageService
    {
        private readonly BinaryFormatter formatter;
        readonly IFileStorageService fileStorageService;

        public BinaryStorageService(IFileStorageService fileStorageService)
        {
            this.fileStorageService = fileStorageService;
            formatter = new BinaryFormatter();
        }

        public T LoadContainer<T>(string fileName)
        {
            var file = fileStorageService.RootDirectory.GetFile(fileName);
            if (file.Exists())
            {
                using (var fs = file.OpenRead())
                {
                    return (T)formatter.Deserialize(fs);
                }
            }
            return default(T);
        }

        public void SaveContainer(IContainer container, string fileName)
        {
            var file = fileStorageService.RootDirectory.GetFile(fileName);
            using (var fileStream = file.OpenWrite())
            {
                formatter.Serialize(fileStream, container);
                container.IsDirty = false;
            }
        }
    }
}
