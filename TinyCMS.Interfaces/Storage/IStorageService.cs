using System.Collections.Generic;

namespace TinyCMS.Storage
{
    public interface IFileStorageService 
    {
        IDirectory RootDirectory { get;}
    }
}
