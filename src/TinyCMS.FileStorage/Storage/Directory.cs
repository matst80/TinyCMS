using System.Collections.Generic;
using System.IO;
using System.Linq;
using TinyCMS.Storage;
using System.Runtime.InteropServices.ComTypes;
using TinyCMS.Data;

namespace TinyCMS.FileStorage.Storage
{
    public class Directory : IDirectory
    {
        public string Name
        {
            get
            {
                return _directoryInfo.Name;
            }
        }

        public bool Exists
        {
            get
            {
                return _directoryInfo.Exists;
            }
        }

        private IDirectory _parent;
        [Ignore]
        public IDirectory Parent
        {
            get
            {
                if (_parent == null)
                {
                    _parent = new Directory(_directoryInfo.Parent);
                }
                return _parent;
            }
            internal set
            {
                _parent = value;
            }
        }

        private DirectoryInfo _directoryInfo;

        public Directory(IDirectory parent, DirectoryInfo directoryInfo)
        {
            _parent = parent;
            this._directoryInfo = directoryInfo;
        }

        public Directory(DirectoryInfo directoryInfo)
        {

            this._directoryInfo = directoryInfo;
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

        public IDirectory GetDirectory(string name)
        {
            var foundDir = directoryInfo.GetDirectories().FirstOrDefault(d => d.Name.Equals(name));
            if (foundDir != null)
            {
                return new Directory(this, foundDir);
            }
            return null;
        }

        public bool HasDirectory(string name)
        {
            return GetDirectory(name) != null;
        }
    }
}
