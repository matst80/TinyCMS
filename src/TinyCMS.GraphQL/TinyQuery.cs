using GraphQL.Types;
using TinyCMS.Interfaces;
using TinyCMS.Data.Nodes;
using Microsoft.AspNetCore.Routing.Tree;

namespace TinyCMS.GraphQL
{
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