using System;
using GraphQL.Server;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using GraphQL.Types;
using GraphQL.Server.Ui.GraphiQL;
using GraphQL.Server.Ui.Playground;
using GraphQL.Server.Ui.Voyager;
using System.Reflection;
using GraphQL.Utilities;
using System.Collections;
using System.Linq;

namespace TinyCMS.GraphQL
{
    public static class GraphQLServiceCollectionExtensions
    {
        private static bool IsAnIEnumerable(Type type) =>
            type != typeof(string) && typeof(IEnumerable).IsAssignableFrom(type) && !type.IsArray;

        public static Type GetGraphTypeFromTypeOrNull(this Type type, bool isNullable = false)
        {
            TypeInfo info = type.GetTypeInfo();

            if (info.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                type = type.GetGenericArguments()[0];
                if (isNullable == false)
                {
                    throw new ArgumentOutOfRangeException(nameof(isNullable),
                        $"Explicitly nullable type: Nullable<{type.Name}> cannot be coerced to a non nullable GraphQL type. \n");
                }
            }

            var graphType = GraphTypeTypeRegistry.Get(type);

            if (type.IsArray)
            {
                var elementType = GetGraphTypeFromTypeOrNull(type.GetElementType(), isNullable);
                if (elementType != null)
                {
                    var listType = typeof(ListGraphType<>);
                    graphType = listType.MakeGenericType(elementType);
                }
            }

            if (IsAnIEnumerable(type))
            {
                var elementType = GetGraphTypeFromTypeOrNull(type.GenericTypeArguments.First(), isNullable);
                if (elementType != null)
                {
                    var listType = typeof(ListGraphType<>);
                    graphType = listType.MakeGenericType(elementType);
                }
            }

            if (graphType == null)
                return null;

            if (!isNullable)
            {
                var nullType = typeof(NonNullGraphType<>);
                graphType = nullType.MakeGenericType(graphType);
            }

            return graphType;
        }

        public static IServiceCollection AddTinyCMSGraphQL(this IServiceCollection services)
        {
            services.AddSingleton<ISchema, TinySchema>();

            // Add GraphQL services and configure options
            services.AddGraphQL(options =>
            {
                options.EnableMetrics = true;
                options.ExposeExceptions = true;
            })
            .AddWebSockets() // Add required services for web socket support
            .AddDataLoader();

            return services;
        }

        public static IApplicationBuilder UseTinyCMSGraphQL(this IApplicationBuilder app)
        {
            app.UseGraphQLWebSockets<ISchema>("/graphql");

            // use HTTP middleware for ChatSchema at path /graphql
            app.UseGraphQL<ISchema>("/graphql");

            // use graphiQL middleware at default url /graphiql
            app.UseGraphiQLServer(new GraphiQLOptions());

            // use graphql-playground middleware at default url /ui/playground
            app.UseGraphQLPlayground(new GraphQLPlaygroundOptions()
            {
                Path = "/ui/playground"
            });

            // use voyager middleware at default url /ui/voyager
            app.UseGraphQLVoyager(new GraphQLVoyagerOptions());
            return app;
        }
    }
}
