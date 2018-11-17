using TinyCMS.Interfaces;
using Newtonsoft.Json;
using System.IO;
using TinyCMS.Data.Builder;
using System;

namespace TinyCMS.FileStorage
{

    public class JsonStorageService : IStorageService
    {
        private readonly JsonSerializer serializer;

        public JsonStorageService()
        {
            this.serializer = JsonSerializer.CreateDefault();
        }

        public T LoadContainer<T>(string fileName)
        {
            var fileInfo = new FileInfo(fileName);
            if (fileInfo.Exists)
            {
                using (var fs = fileInfo.OpenRead())
                {
                    using (var streamReader = new StreamReader(fs))
                    {
                        using (var jsonTextReader = new JsonTextReader(streamReader))
                        {
                            return (T)serializer.Deserialize<T>(jsonTextReader);
                        }
                    }
                }
            }
            return default(T);

        }

        public void SaveContainer(IContainer container, string fileName)
        {
            var oldFileName = fileName + ".old";
            if (File.Exists(fileName))
            {
                if (File.Exists(oldFileName))
                {
                    File.Delete(oldFileName);
                }
                File.Move(fileName, oldFileName);
            }
            var fileInfo = new FileInfo(fileName);
            using (var fileStream = fileInfo.OpenWrite())
            {
                using (var streamWriter = new StreamWriter(fileStream))
                {
                    using (var jsonTextWriter = new JsonTextWriter(streamWriter))
                    {
                        try
                        {
                            serializer.Serialize(jsonTextWriter, container);
                        }
                        catch (Exception error)
                        {
                            var i = 2;
                        }
                    }
                }
            }

        }
    }
}
