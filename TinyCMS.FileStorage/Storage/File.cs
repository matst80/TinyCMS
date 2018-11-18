using System.Collections.Generic;
using System.IO;
using TinyCMS.Storage;
using System.Collections;

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

        public IDirectory Directory { get; internal set; }

        private const string PathSeparator = "/";

        private string GetDiskPath()
        {
            var dirParts = new List<string>();
            var parent = Directory;
            while (parent != null)
            {
                dirParts.Add(parent.Name);
                parent = parent.Parent;
            }
            dirParts.Reverse();
            return string.Join(PathSeparator, dirParts) + PathSeparator + Name;
        }

        private FileInfo _fileInfo;
        private FileInfo fileInfo
        {
            get
            {
                if (_fileInfo==null)
                    _fileInfo = new FileInfo(GetDiskPath());
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

        public bool Exists()
        {
            return fileInfo.Exists;
        }
    }
}
