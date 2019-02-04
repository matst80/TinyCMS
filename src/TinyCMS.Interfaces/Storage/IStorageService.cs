using System.Collections.Generic;

namespace TinyCMS.Storage
{
    public interface IFileStorageService 
    {
        IDirectory RootDirectory { get;}
        IFile GetFile(string path);
        IDirectory GetDirectory(string path);
    }
}
