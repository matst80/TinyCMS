using TinyCMS.Commerce;
using GraphQL.Types;
using TinyCMS.Commerce.Services;
using GraphQL.Resolvers;
using TinyCMS.Commerce.Models;
using TinyCMS.GraphQL;

namespace TinyCMS
{
    public class CommerceGraphQL
    {
        //private readonly IShopFactory shopFactory;

        public CommerceGraphQL(IShopFactory shopFactory, ISchema schema)
        {
            //            this.shopFactory = shopFactory;

            var orderResolver = new OrderResolver(shopFactory.OrderService);

            schema.Query.AddField(new FieldType()
            {
                Name = "order",
                Resolver = orderResolver,
                Arguments = TinyQuery.GetIdQuery(),
                Type = typeof(AutoRegisteringObjectGraphType<IOrder>),
                ResolvedType = new AutoRegisteringObjectGraphType<IOrder>()
            });
        }
    }

    public class OrderResolver : IFieldResolver
    {
        private readonly IOrderService orderService;

        public OrderResolver(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        public object Resolve(ResolveFieldContext context)
        {
            var id = context.GetArgument<string>("id");
            return orderService.GetOrder(id);
        }
    }


}