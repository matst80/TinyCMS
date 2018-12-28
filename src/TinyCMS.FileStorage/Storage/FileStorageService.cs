using System;
using TinyCMS.Storage;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace TinyCMS.FileStorage.Storage
{
    public class FileStorageService : IFileStorageService
    {
        public FileStorageService(IHostingEnvironment hostingEnvironment)
        {
            RootDirectory = new Directory(null, new DirectoryInfo(hostingEnvironment.ContentRootPath));
        }

        public FileStorageService(string rootDir)
        {
            RootDirectory = new Directory(null, new DirectoryInfo(rootDir));
        }

        public IDirectory RootDirectory { get; internal set; }
    }
}
