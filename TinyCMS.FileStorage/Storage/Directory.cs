using System.Collections.Generic;
using System.IO;
using System.Linq;
using TinyCMS.Storage;
using System.Runtime.InteropServices.ComTypes;

namespace TinyCMS.FileStorage.Storage
{
    public class Directory : IDirectory
    {
        public string Name { get; internal set; }

        public IDirectory Parent { get; internal set; }

        private const string PathSeparator = "/";
        private DirectoryInfo _directoryInfo;

        public Directory(IDirectory parent, DirectoryInfo directoryInfo1)
        {
            Parent = parent;
            this._directoryInfo = directoryInfo1;
        }

        private string GetDiskPath()
        {
            var dirParts = new List<string>();
            var parent = Parent;
            while (parent != null)
            {
                dirParts.Add(parent.Name);
                parent = parent.Parent;
            }
            dirParts.Reverse();
            return string.Join(PathSeparator, dirParts) + PathSeparator + Name;
        }

        private DirectoryInfo directoryInfo
        {
            get
            {
                if (_directoryInfo == null)
                    _directoryInfo = new DirectoryInfo(GetDiskPath());
                return _directoryInfo;
            }
        }


        public IEnumerable<IFile> GetFiles()
        {
            return directoryInfo.GetFiles().Select((file) => new File(file, this));
        }

        public IEnumerable<IDirectory> GetDirectories()
        {
            return directoryInfo.GetDirectories().Select((dir) => new Directory(this, dir));
        }

        public void UploadFile(IFile file)
        {

        }

        public IFile GetFile(string fileName)
        {
             return new File(new FileInfo(directoryInfo.FullName+PathSeparator + fileName), this);
        }
    }
}
