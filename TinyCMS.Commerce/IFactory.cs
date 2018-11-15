using System;

namespace TinyCMS.Commerce
{
    public interface IFactory
    {
        T CreateInstance<T>();
        object CreateInstance(Type type);
    }
}