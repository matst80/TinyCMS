using GraphQL.Types;
using TinyCMS.Interfaces;
using GraphQL.Resolvers;
using System;

namespace TinyCMS.GraphQL
{
    public class NodeResolver : IFieldResolver
    {
        private readonly IContainer container;
        private string typeName;
        private Type type;

        public NodeResolver(IContainer container)
        {
            this.container = container;
        }

        public NodeResolver(IContainer container, string typeName, Type type) : this(container)
        {
            this.typeName = typeName;
            this.type = type;
        }

        public object Resolve(ResolveFieldContext context)
        {

            var id = context.GetArgument<string>("id");
            return container.GetById(id);
        }
    }
}