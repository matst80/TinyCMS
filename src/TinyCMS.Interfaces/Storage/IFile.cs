using System;
using System.Collections;
using System.IO;

namespace TinyCMS.Storage
{
    public interface IFile
    {
        string Name { get; }
        IDirectory Directory { get; }
        Stream OpenRead();
        Stream OpenWrite();
        void Delete();
        void Move(string newFileName);
        bool Exists { get; }
    }
}
