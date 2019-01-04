using TinyCMS.Commerce;
using GraphQL.Types;
using TinyCMS.Commerce.Services;
using GraphQL.Resolvers;
using TinyCMS.Commerce.Models;
using TinyCMS.GraphQL;
using TinyCMS.GraphQL.Interfaces;
using System.Reflection;
using System.Linq;
using GraphQL;
using System;
using System.Collections.Generic;
using GraphQL.Utilities;

namespace TinyCMS
{
    public class CommerceGraphQL : IGraphQLPlugin
    {
        private readonly IShopFactory shopFactory;

        public CommerceGraphQL(IShopFactory shopFactory)
        {
            this.shopFactory = shopFactory;
        }

        public void OnGraphInit(IObjectGraphType query, IObjectGraphType mutation)
        {
            var orderService = shopFactory.OrderService;
            //var orderResolver = new OrderResolver(orderService);
            var orderResolver = new FuncFieldResolver<IOrder>((ctx) => orderService.GetOrder(ctx.GetArgument<string>("id")));
            //var orderArticleResolver = new FuncFieldResolver<IEnumerable<IOrderArticle>>((ctx) => (ctx.Source as IOrder).Articles);

            var order = shopFactory.CreateInstance<IOrder>();
            var orderArticle = shopFactory.CreateInstance<IOrderArticle>();

            GraphTypeTypeRegistry.Register(typeof(IOrderArticle), typeof(ReflectionObjectGraphType<IOrderArticle>));

            query.AddField(new FieldType()
            {
                Name = "orderarticle",
                //Resolver = orderResolver,
                Type = orderArticle.GetType(),
                ResolvedType = new ReflectionObjectGraphType<IOrderArticle>()
            });

            query.AddField(new FieldType()
            {
                Name = "order",
                Resolver = orderResolver,
                Arguments = TinyQuery.GetIdQuery(),
                Type = order.GetType(),
                ResolvedType = new ReflectionObjectGraphType<IOrder>()
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

    public class OrderReflectionGraphType : ObjectGraphType<IOrder>
    {
        private static string[] CONSTANT_PROPERTIES = { "Articles", "Id" };
        private readonly IOrderService orderService;

        private bool IsValidProperty(PropertyInfo d)
        {
            return (
                d.CanRead &&
                !CONSTANT_PROPERTIES.Contains(d.Name) &&
                (d.PropertyType.GetTypeInfo().IsValueType || d.PropertyType == typeof(string))
            );
        }

        public OrderReflectionGraphType(IOrderService orderService) : this()
        {
            Name = "order";
            var type = orderService.GetNewOrder().GetType();
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
                catch (ArgumentOutOfRangeException ex)
                {
                    Field(typeof(StringGraphType), prp.Name, resolve: (ctx) =>
                    {
                        return prp.GetValue(ctx.Source).ToString();
                    });
                }
            }

            this.orderService = orderService;
        }

        public OrderReflectionGraphType()
        {
            var type = this.GetType();
            Field(h => h.Id).Description("The id of the node.");


            //Field<ListGraphType<NodeReflectionGraphType>>(
            //    "Articles",
            //    resolve: context => context.Source.Articles
            //);

            //Field<ListGraphType<NodeReflectionGraphType>>(
            //    "Relations",
            //    resolve: context => container?.GetRelationsById(context.Source.Id)
            //);
        }
    }

}