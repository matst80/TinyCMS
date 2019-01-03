using GraphQL.Types;
using System;
using System.Collections.Generic;

namespace TinyCMS.GraphQL
{
    //public class NodeGraphType : IObjectGraphType
    //{
    //    private readonly IDictionary<string, object> metadata;

    //    public NodeGraphType(string typeName, Type nodeType)
    //    {
    //        metadata = new Dictionary<string, object>();
    //        Name = typeName;

    //    }

    //    public string Description { get; set; }
    //    public string DeprecationReason { get; set; }

    //    public IDictionary<string, object> Metadata => metadata;

    //    public string Name { get; set; }
    //    public Func<object, bool> IsTypeOf { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

    //    public IEnumerable<FieldType> Fields => throw new NotImplementedException();

    //    public IEnumerable<Type> Interfaces { get; set; } = new List<Type>();
    //    public IEnumerable<IInterfaceGraphType> ResolvedInterfaces { get; set; } = new List<Type>();

    //    public string CollectTypes(TypeCollectionContext context)
    //    {
    //        return Name;
    //    }

    //    protected bool Equals(IGraphType other)
    //    {
    //        return string.Equals(Name, other.Name);
    //    }

    //    public TType GetMetadata<TType>(string key, TType defaultValue = default(TType))
    //    {
    //        if (!HasMetadata(key))
    //        {
    //            return defaultValue;
    //        }

    //        if (Metadata.TryGetValue(key, out var item))
    //        {
    //            return (TType)item;
    //        }

    //        return defaultValue;
    //    }

    //    public bool HasMetadata(string key)
    //    {
    //        return Metadata?.ContainsKey(key) ?? false;
    //    }

    //    public override int GetHashCode()
    //    {
    //        return Name?.GetHashCode() ?? 0;
    //    }

    //    public void AddResolvedInterface(IInterfaceGraphType graphType)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public FieldType AddField(FieldType fieldType)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public bool HasField(string name)
    //    {
    //        throw new NotImplementedException();
    //    }

    //    public FieldType GetField(string name)
    //    {
    //        throw new NotImplementedException();
    //    }
    //}
}