using GraphQL.Types;
using TinyCMS.Interfaces;
using GraphQL.Resolvers;

namespace TinyCMS.GraphQL
{
    public class NodeResolver : IFieldResolver
    {
        private readonly IContainer container;

        public NodeResolver(IContainer container)
        {
            this.container = container;
        }

        public object Resolve(ResolveFieldContext context)
        {
            var id = context.GetArgument<string>("id");
            return container.GetById(id);
        }
    }
}
