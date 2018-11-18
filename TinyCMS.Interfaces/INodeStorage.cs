using TinyCMS.Interfaces;

namespace TinyCMS.FileStorage
{
    public interface INodeStorage
    {
        void Store(IContainer cnt);

        IContainer Load();

    }
}
