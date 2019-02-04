using System;
using TinyCMS.Storage;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace TinyCMS.FileStorage.Storage
{
    public class FileStorageService : IFileStorageService
    {
        private string rootDir;

        public FileStorageService(IHostingEnvironment hostingEnvironment) : this(hostingEnvironment.ContentRootPath)
        {

        }

        public FileStorageService(string rootDir)
        {
            this.rootDir = rootDir;
            RootDirectory = new Directory(null, new DirectoryInfo(rootDir));
        }

        public IDirectory RootDirectory { get; internal set; }

        public IDirectory GetDirectory(string path)
        {
            var fileSystemDirectory = new DirectoryInfo(Path.Combine(rootDir, path));
            if (fileSystemDirectory != null)
                return new Directory(fileSystemDirectory);
            return null;
        }

        public IFile GetFile(string path)
        {

            var file = new FileInfo(Path.Combine(rootDir, path));
            if (file != null) {
                return new File(file, new Directory(file.Directory));
            }
            return null;
        }
    }
}
