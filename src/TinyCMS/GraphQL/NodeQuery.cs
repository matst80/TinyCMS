using System;
using GraphQL.Types;
using TinyCMS.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace TinyCMS.GraphQL
{

    public class NodeQuery : IObjectGraphType
    {
        //private readonly IContainer container;
        //private readonly INodeTypeFactory factory;

        public NodeQuery(IContainer container, INodeTypeFactory factory)
        {
            //this.container = container;
            //this.factory = factory;
            var nodeResolver = new NodeResolver(container);

            foreach (var typeName in factory.RegisterdTypeNames())
            {
                var type = factory.GetTypeByName(typeName);
                var ft = new FieldType()
                {
                    Arguments = new QueryArguments(
                        new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "id", Description = "id of the node" }
                    ),
                    Resolver = nodeResolver,
                    Name = typeName,
                    Type = type,
                    ResolvedType = new NodeGraphType(typeName, type)
                };
                fields.Add(ft);
            }


            IsTypeOf = type => type is INode;

        }

        public Func<object, bool> IsTypeOf { get; set; }

        private List<FieldType> fields = new List<FieldType>();
        public IEnumerable<FieldType> Fields
        {
            get
            {
                return fields;
            }
        }

        public string Description { get; set; }
        public string DeprecationReason { get; set; }

        private Dictionary<string, object> metadata = new Dictionary<string, object>();
        private static List<IInterfaceGraphType> resolvedInterfaces = new List<IInterfaceGraphType>();
        private static List<Type> interfaces = new List<Type>();

        public IDictionary<string, object> Metadata
        {
            get
            {
                return metadata;
            }
        }

        public string Name { get; set; } = "node";

        public IEnumerable<Type> Interfaces { get; set; } = interfaces;

        public IEnumerable<IInterfaceGraphType> ResolvedInterfaces { get; set; } = resolvedInterfaces;

        public FieldType AddField(FieldType fieldType)
        {
            fields.Add(fieldType);
            return fieldType;
        }

        public void AddResolvedInterface(IInterfaceGraphType graphType)
        {
            resolvedInterfaces.Add(graphType);
        }

        public string CollectTypes(TypeCollectionContext context)
        {
            return Name;
        }

        public bool HasField(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return false;

            return fields.Any(x => string.Equals(x.Name, name, StringComparison.Ordinal));
        }

        public FieldType GetField(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return null;

            return fields.Find(x => string.Equals(x.Name, name, StringComparison.Ordinal));
        }

        public TType GetMetadata<TType>(string key, TType defaultValue = default(TType))
        {
            if (!HasMetadata(key))
            {
                return defaultValue;
            }

            if (Metadata.TryGetValue(key, out var item))
            {
                return (TType)item;
            }

            return defaultValue;
        }

        public bool HasMetadata(string key)
        {
            return Metadata?.ContainsKey(key) ?? false;
        }
    }
}
