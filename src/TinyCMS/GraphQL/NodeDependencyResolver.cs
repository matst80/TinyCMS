using System;
using GraphQL;
using TinyCMS.Interfaces;
using System.Linq;

namespace TinyCMS.GraphQL
{
    public class NodeDependencyResolver : IDependencyResolver
    {
        private readonly IContainer container;
        private readonly INodeTypeFactory factory;

        public NodeDependencyResolver(IContainer container, INodeTypeFactory factory)
        {
            this.container = container;
            this.factory = factory;
        }

        public T Resolve<T>()
        {
            return (T)GetGeneric(typeof(T));
        }

        public object GetGeneric(Type type)
        {
            var generic = type.GenericTypeArguments.FirstOrDefault();
            if (generic != null)
            {
                var baseType = typeof(NodeType<>);
                return Activator.CreateInstance(baseType.MakeGenericType(generic));
            }
            return Activator.CreateInstance(type);
        }

        public object Resolve(Type type)
        {
            return GetGeneric(type);
        }
    }
}
