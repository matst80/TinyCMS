using GraphQL.Types;
using TinyCMS.Interfaces;

namespace TinyCMS.GraphQL
{
    public class NodeInterface : InterfaceGraphType<INode>
    {
        public NodeInterface()
        {
            Name = "node";
            Field(typeof(StringGraphType), "Id");
            Field(typeof(StringGraphType), "ParentId");
            Field(typeof(StringGraphType), "Type");
            Field<ListGraphType<NodeReflectionGraphType>>(
                "children",
                resolve: context => context.Source.Children
            );
        }
    }
}