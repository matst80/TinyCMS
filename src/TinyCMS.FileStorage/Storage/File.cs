using System.Collections.Generic;
using System.IO;
using TinyCMS.Storage;
using System.Collections;
using TinyCMS.Data;

namespace TinyCMS.FileStorage.Storage
{
    public class File : IFile
    {
        public File(IDirectory parent, string name)
        {
            Name = name;
            Directory = parent;
        }

        public File(FileInfo fileInfo, IDirectory parent)
        {
            _fileInfo = fileInfo;
            Name = _fileInfo.Name;
            Directory = parent;
        }

        public string Name { get; internal set; }

        [Ignore]
        public IDirectory Directory { get; internal set; }

        private FileInfo _fileInfo;
        private FileInfo fileInfo
        {
            get
            {
                return _fileInfo;
            }
        }

        public void Delete()
        {
            fileInfo.Delete();
        }

        public void Move(string newFileName)
        {
            fileInfo.MoveTo(newFileName);
        }

        public Stream OpenRead()
        {
            return fileInfo.OpenRead();
        }

        public Stream OpenWrite()
        {
            return fileInfo.OpenWrite();
        }

        public bool Exists
        {
            get
            {
                return fileInfo.Exists;
            }
        }
    }
}
