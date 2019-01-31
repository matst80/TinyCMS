using System;
using GraphQL.Types;
using TinyCMS.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using TinyCMS.GraphQL.Interfaces;

namespace TinyCMS.GraphQL
{
    public class TinySchema : Schema
    {
        private readonly IContainer container;
        private readonly INodeTypeFactory factory;

        public TinySchema(IContainer container, INodeTypeFactory factory, IServiceProvider serviceProvider)
        {
            this.container = container;
            this.factory = factory;

            Query = new TinyQuery(container, factory);
            Mutation = new TinyMutation(container, factory);
            foreach (var plugin in serviceProvider.GetServices<IGraphQLPlugin>())
            {
                plugin.OnGraphInit(Query, Mutation);
            }
        }
    }
}