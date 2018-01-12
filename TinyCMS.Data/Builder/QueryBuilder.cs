using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace TinyCMS.Data.Builder
{
    public class QueryBuilder
    {

    }

    public class NodeTypeFactory
    {
        public NodeTypeFactory()
        {
            RegisterTypes(this.GetType().Assembly);
        }

        public INode GetNew(string type)
        {
            if (_types.ContainsKey(type))
                return Activator.CreateInstance(_types[type]) as INode;
            return null;
        }

        private Dictionary<string, Type> _types = new Dictionary<string, Type>();

        public void RegisterTypes(Assembly ass)
        {
            var baseType = typeof(INode);
            var types = ass.GetExportedTypes();
            foreach (var type in types)
            {
                if (type.GetTypeInfo().ImplementedInterfaces.Contains(baseType))
                {
                    try
                    {
                        var inst = Activator.CreateInstance(type) as INode;
                        if (inst != null)
                        {
                            _types.Add(inst.Type, type);
                        }
                    }
                    catch
                    {

                    }
                }
            }
        }
    }
}
