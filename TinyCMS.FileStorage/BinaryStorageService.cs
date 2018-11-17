using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using TinyCMS.Interfaces;
namespace TinyCMS.FileStorage
{
    public class BinaryStorageService : IStorageService
    {
        private readonly BinaryFormatter formatter;

        public BinaryStorageService()
        {
            formatter = new BinaryFormatter();
        }

        public T LoadContainer<T>(string fileName)
        {
            var fileInfo = new FileInfo(fileName);
            if (fileInfo.Exists)
            {
                using (var fs = fileInfo.OpenRead())
                {
                    return (T)formatter.Deserialize(fs);
                }
            }
            return default(T);
        }

        public void SaveContainer(IContainer container, string fileName)
        {
            using(FileStream fs = new FileStream(fileName, FileMode.Create))
            {
                formatter.Serialize(fs, container);
                container.IsDirty = false;
            }
        }
    }
}
