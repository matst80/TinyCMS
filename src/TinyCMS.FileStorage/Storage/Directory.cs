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

        private DirectoryInfo _directoryInfo;

        public Directory(IDirectory parent, DirectoryInfo directoryInfo1)
        {
            Parent = parent;
            this._directoryInfo = directoryInfo1;
        }

        private DirectoryInfo directoryInfo
        {
            get
            {
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
            return new File(new FileInfo(directoryInfo.FullName + Path.DirectorySeparatorChar + fileName), this);
        }
    }
}
