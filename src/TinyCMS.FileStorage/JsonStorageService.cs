using TinyCMS.Interfaces;
using Newtonsoft.Json;
using System.IO;
using TinyCMS.Data.Builder;
using System;
using TinyCMS.Storage;

namespace TinyCMS.FileStorage
{

    public class JsonStorageService : IStorageService
    {
        private readonly JsonSerializer serializer;
        readonly IFileStorageService fileStorageService;

        public JsonStorageService(IFileStorageService fileStorageService)
        {
            this.fileStorageService = fileStorageService;
            this.serializer = JsonSerializer.CreateDefault();

        }

        public T LoadContainer<T>(string fileName)
        {
            var file = fileStorageService.RootDirectory.GetFile(fileName);
            if (file.Exists())
            {
                using (var fs = file.OpenRead())
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
            var file = fileStorageService.RootDirectory.GetFile(fileName);
            if (file.Exists())
            {
                file.Delete();
            }
            using (var fileStream = file.OpenWrite())
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
