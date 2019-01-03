using GraphQL.Types;
using TinyCMS.Interfaces;
using System.Linq;
using System;
using TinyCMS.Data.Nodes;
using Microsoft.AspNetCore.Routing.Tree;
using GraphQL;
using System.Reflection;

namespace TinyCMS.GraphQL
{
    internal class TinyQuery : ObjectGraphType
    {
        private IContainer container;
        private INodeTypeFactory factory;

        public TinyQuery(IContainer container, INodeTypeFactory factory)
        {
            this.container = container;
            this.factory = factory;

            Field<RootNode>("root", resolve: ctx => container.RootNode);
            Field<RootNode>(
                "node",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "id", Description = "id of the node" }
                ),
                resolve: ctx => container.GetById(ctx.GetArgument<string>("id"))
            );
            var node = GetField("node");


            var nodeResolver = new NodeResolver(container);

            foreach (var typeName in factory.RegisterdTypeNames())
            {
                var type = factory.GetTypeByName(typeName);
                var ft = new FieldType()
                {
                    Arguments = new QueryArguments(
                        new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "id", Description = "id of the node" }
                    ),
                    Resolver = new NodeResolver(container, typeName, type),
                    Name = typeName,
                    Type = node.Type,
                    ResolvedType = new RootNode(typeName, type)
                };
                AddField(ft);
            }

        }
    }

    public interface INodeType
    {
        INode Node { get; set; }
    }

    public class RootNode : ObjectGraphType<INode>
    {
        private bool IsValidProperty(PropertyInfo d)
        {
            return d.CanRead && d.PropertyType.GetTypeInfo().IsValueType || d.PropertyType == typeof(string) && d.Name != "Children" && d.Name != "Id";
        }

        public RootNode(string name, Type type) : this()
        {
            Name = name;
            foreach (var prp in type.GetProperties().Where(IsValidProperty))
            {
                try
                {
                    var graphType = prp.PropertyType.GetGraphTypeFromType(prp.PropertyType.IsNullable());
                    if (graphType != null)
                    {
                        Field(graphType, prp.Name, resolve: (ctx) =>
                        {
                            return prp.GetValue(ctx.Source);
                        });
                    }
                }
                catch(ArgumentOutOfRangeException ex)
                {
                    Field(typeof(StringGraphType), prp.Name, resolve: (ctx) =>
                    {
                        return prp.GetValue(ctx.Source).ToString();
                    });
                }
            }
        }

        public RootNode()
        {
            var type = this.GetType();
            Field(h => h.Id).Description("The id of the node.");
            //Field(h => h.Type).Description("The type of the node.");
            //Field(h => h.ParentId, true).Description("The parentId of the node.");

            Field<ListGraphType<RootNode>>(
                "children",
                resolve: context => context.Source.Children
            );
        }
    }

    //public static class QLExt
    //{
    //    public static NodeType<T> GetNode<T>(this INode node) where T : INode
    //    {
    //        var ret = new NodeType<T>(node);
    //        return ret;
    //    }

    //    public static object GetNode(this INode node)
    //    {
    //        var type = node.GetType();
    //        var generic = typeof(NodeType<>);
    //        var resultType = generic.MakeGenericType(type);
    //        var ret = Activator.CreateInstance(resultType, node);
    //        return ret;
    //    }
    //}

    public class NodeInterface : InterfaceGraphType<INode>
    {
        public NodeInterface()
        {
            Name = "node";
            Field(typeof(StringGraphType), "Id");
            Field(typeof(StringGraphType), "ParentId");
            Field(typeof(StringGraphType), "Type");
            Field<ListGraphType<RootNode>>(
                "children",
                resolve: context => context.Source.Children
            );
        }
    }

    public class NodeType<T> : ObjectGraphType<T>, INodeType where T : INode
    {
        public NodeType()
        {
            Interface<NodeInterface>();
            Field(typeof(StringGraphType), "Id", resolve: ctx => ctx.Source.Id);
            Field(typeof(StringGraphType), "ParentId", resolve: ctx => ctx.Source.ParentId);
            Field(typeof(StringGraphType), "Type", resolve: ctx => ctx.Source.Type);



        }

        public INode Node { get; set; }

        public NodeType(INode node) : this()
        {
            this.Node = node;
            Name = node.Type;

            //Field(typeof(StringGraphType), "id", resolve: ctx => Node.Id);

        }
    }
}