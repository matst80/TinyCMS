using GraphQL.Types;
using TinyCMS.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace TinyCMS.GraphQL
{
    public class TinyReflectionQuery : IObjectGraphType
    {
        public TinyReflectionQuery(IContainer container, INodeTypeFactory factory)
        {
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
                    ResolvedType = new RootNode(typeName, type)
                };
                fields.Add(ft);
            }


            IsTypeOf = type => type is INode;
        }

        private List<FieldType> fields = new List<FieldType>();
        private List<IInterfaceGraphType> resolvedInterfaces = new List<IInterfaceGraphType>();

        public IEnumerable<FieldType> Fields
        {
            get
            {
                return fields;
            }
        }

        public string Description { get; set; }
        public string DeprecationReason { get; set; }

        public IDictionary<string, object> Metadata { get; set; } = new Dictionary<string, object>();

        public string Name { get; set; } = "query";

        public IEnumerable<Type> Interfaces { get; set; } = new List<Type>();
        public IEnumerable<IInterfaceGraphType> ResolvedInterfaces
        {
            get
            {
                return resolvedInterfaces;
            }
            set
            {
                resolvedInterfaces.Clear();
                resolvedInterfaces.AddRange(value);
            }
        }
        public Func<object, bool> IsTypeOf { get; set; }

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