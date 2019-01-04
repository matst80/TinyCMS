using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace TinyCMS.Base
{
    //public class PluginFactory : IPluginFactory
    //{
    //    public PluginFactory(IServiceProvider serviceProvider)
    //    {
    //        this.serviceProvider = serviceProvider;
    //    }

    //    private readonly List<Type> plugins;
    //    private readonly IServiceProvider serviceProvider;

    //    public PluginFactory()
    //    {
    //        plugins = new List<Type>();
    //    }

    //    public void AddPlugin<T>()
    //    {
    //        AddPlugin(typeof(T));
    //    }

    //    public void AddPlugin(Type type)
    //    {
    //        plugins.Add(type);
    //    }

    //    public IEnumerable<T> GetPlugins<T>()
    //    {
    //        var type = typeof(T);
    //        return plugins.Where(d => type.IsAssignableFrom(d)).OfType<T>();
    //    }

    //    public IEnumerable<Type> GetPlugins(Type type)
    //    {
    //        return plugins.Where(d => type.IsAssignableFrom(d));
    //    }

    //    public void RemovePlugin(Type type)
    //    {
    //        plugins.Remove(type);
    //    }

    //    public object GetInstance(Type type)
    //    {

    //        serviceProvider.GetService(type)
    //    }

    //    public T GetInstance<T>()
    //    {
    //        throw new NotImplementedException();
    //    }
    //}

    //public interface IPluginFactory
    //{
    //    IEnumerable<T> GetPlugins<T>();

    //    IEnumerable<Type> GetPlugins(Type type);

    //    void AddPlugin<T>();

    //    void AddPlugin(Type type);

    //    void RemovePlugin(Type type);

    //    object GetInstance(Type type);

    //    T GetInstance<T>();
    //}
}
