using TinyCMS.Interfaces;
namespace TinyCMS.FileStorage
{
    public interface IStorageService
    {
        T LoadContainer<T>(string fileName);
        void SaveContainer(IContainer container, string fileName);
    }
}
