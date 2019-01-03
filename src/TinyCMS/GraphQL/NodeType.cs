using System;
using GraphQL.Types;
using TinyCMS.Interfaces;
using TinyCMS.Serializer;
using TinyCMS.Data.Nodes;

namespace TinyCMS.GraphQL
{
    public class NodeType<T> : ObjectGraphType<T> where T : INode
    {
        public NodeType()
        {
            var node = Activator.CreateInstance(typeof(T)) as INode;
            Name = node.Type;
            EnumFields();
        }

        public NodeType(string name)
        {
            Name = name;
            EnumFields();
        }

        private void EnumFields()
        {
            var type = typeof(T);
            Field(h => h.Id);
            Field(h => h.ParentId);
            //Field(h => h.Children);
            Field(h => h.Type);
            Field(h => h.Tags);
            //foreach (var kv in type.GetPropertyInfoList())
            //{

            //    Field(kv.Value.PropertyType, kv.Key);
            //}
        }
    }

    public class BaseNodeType : NodeType<Site>
    {

    }
}
