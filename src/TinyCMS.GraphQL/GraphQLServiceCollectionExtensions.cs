using System;
using GraphQL.Server;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using GraphQL.Types;
using GraphQL.Server.Ui.GraphiQL;
using GraphQL.Server.Ui.Playground;
using GraphQL.Server.Ui.Voyager;

namespace TinyCMS.GraphQL
{
    public static class GraphQLServiceCollectionExtensions
    {

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
