using System.Collections.Generic;

namespace TinyCMS.Storage
{
    public interface IDirectory
    {
        string Name { get; }
        bool Exists { get; }
        IDirectory Parent { get; }
        IEnumerable<IFile> GetFiles();
        IEnumerable<IDirectory> GetDirectories();
        bool HasDirectory(string name);
        IDirectory GetDirectory(string name);
        void UploadFile(IFile file);
        IFile GetFile(string fileName);
    }
}
