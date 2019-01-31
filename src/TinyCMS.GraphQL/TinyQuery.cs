using GraphQL.Types;
using TinyCMS.Interfaces;
using TinyCMS.Data.Nodes;
using System;
using System.Linq;
using System.Reflection;
using GraphQL.Utilities;
using TinyCMS.Serializer;

namespace TinyCMS.GraphQL
{
    public class TinyMutation : ObjectGraphType
    {
        private IContainer container;
        private INodeTypeFactory factory;

        public TinyMutation(IContainer container, INodeTypeFactory factory)
        {
            this.container = container;
            this.factory = factory;

            RegisterNodeTypes();
        }

        private void RegisterNodeTypes()
        {
            var nodeResolver = new NodeResolver(container);

            foreach (var typeName in factory.RegisterdTypeNames())
            {
                var type = factory.GetTypeByName(typeName);
                AddField(new FieldType()
                {
                    Arguments = GetCreateArguments(type),
                    Resolver = nodeResolver,
                    Name = "create"+typeName.ToUpperFirst(),
                    Type = type,
                    ResolvedType = new NodeReflectionGraphType(typeName, type, container)
                });
            }
        }

        private bool IsValidProperty(PropertyInfo d)
        {
            return (
                d.CanWrite &&
                (d.PropertyType.GetTypeInfo().IsValueType || d.PropertyType == typeof(string))
            );
        }

        private QueryArguments GetCreateArguments(Type type)
        {
            return new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "parentId", Description = "Parent node id" }
            );

            //var ret = new QueryArguments();
            //foreach (var prp in type.GetProperties().Where(IsValidProperty))
            //{
            //    var graphType = GraphTypeTypeRegistry.Get(prp.PropertyType);
            //    if (graphType != null)
            //    {
            //        ret.Add(new QueryArgument(graphType)
            //        {
            //            Name = prp.Name
            //        });
            //    }

            //}
            //return ret;

        }
    }

    public class TinyQuery : ObjectGraphType
    {
        private IContainer container;
        private INodeTypeFactory factory;

        public TinyQuery(IContainer container, INodeTypeFactory factory)
        {
            this.container = container;
            this.factory = factory;

            Field<NodeReflectionGraphType>("root", resolve: ctx => container.RootNode);
            Field<NodeReflectionGraphType>(
                "node",
                arguments: GetIdQuery(),
                resolve: ctx => container.GetById(ctx.GetArgument<string>("id"))
            );

            RegisterNodeTypes();
        }

        private void RegisterNodeTypes()
        {
            var nodeResolver = new NodeResolver(container);

            foreach (var typeName in factory.RegisterdTypeNames())
            {
                var type = factory.GetTypeByName(typeName);
                AddField(new FieldType()
                {
                    Arguments = GetIdQuery(),
                    Resolver = nodeResolver,
                    Name = typeName,
                    Type = type,
                    ResolvedType = new NodeReflectionGraphType(typeName, type, container)
                });
            }
        }

        public static QueryArguments GetIdQuery()
        {
            return new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "id", Description = "id of the node" }
            );
        }
    }
}