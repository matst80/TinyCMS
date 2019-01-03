using System;
using GraphQL.Types;
using System.Collections.Generic;

namespace TinyCMS.GraphQL
{
    public class NodeGraphType : IGraphType
    {
        private readonly IDictionary<string, object> metadata;

        public NodeGraphType(string typeName, Type nodeType)
        {
            metadata = new Dictionary<string, object>();
            Name = typeName;

        }

        public string Description { get; set; }
        public string DeprecationReason { get; set; }

        public IDictionary<string, object> Metadata => metadata;

        public string Name { get; set; }

        public string CollectTypes(TypeCollectionContext context)
        {
            return Name;
        }

        protected bool Equals(IGraphType other)
        {
            return string.Equals(Name, other.Name);
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

        public override int GetHashCode()
        {
            return Name?.GetHashCode() ?? 0;
        }
    }
}
