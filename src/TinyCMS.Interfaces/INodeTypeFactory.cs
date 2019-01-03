using System;
using System.Collections.Generic;
using System.Reflection;
using TinyCMS.Interfaces;

namespace TinyCMS.Interfaces
{
    public interface INodeTypeFactory
    {
        INode GetNew(string type);
        //T GetNew<T>();
        string GetNameByType(Type type);
        Type GetTypeByName(string typeName);
        List<string> RegisterdTypeNames();
        void RegisterTypes(Assembly ass);
    }
}