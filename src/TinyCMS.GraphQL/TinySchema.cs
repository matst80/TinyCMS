using GraphQL.Types;
using TinyCMS.Interfaces;

namespace TinyCMS.GraphQL
{
    public class TinySchema : Schema
    {
        private readonly IContainer container;
        private readonly INodeTypeFactory factory;

        public TinySchema(IContainer container, INodeTypeFactory factory)
        {
            this.container = container;
            this.factory = factory;

            Query = new TinyQuery(container, factory);
        }
    }
}