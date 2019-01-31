using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using TinyCMS.Data.Builder;
using TinyCMS.FileStorage;
using TinyCMS.Interfaces;
using TinyCMS.Serializer;
using TinyCMS.SocketServer;
using TinyCMS.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TinyCMS.Commerce;
using TinyCMS.Commerce.Models;
using TinyCMS.Commerce.Services;
using TinyCMS.Proxy;
using TinyCMS.Commerce.Nodes;
using TinyCMS.Storage;
using TinyCMS.FileStorage.Storage;
using TinyCMS.Base;
using TinyCMS.Node.ResizeImage;
using TinyCMS.QuestionNodes;
using GraphQL.Types;
using GraphQL;
using GraphQL.Http;
using GraphQL.Server;
using Microsoft.AspNetCore.Http;
using GraphQL.Server.Ui.Playground;
using TinyCMS.GraphQL;
using TinyCMS.GraphQL.Interfaces;
using System.Collections.Generic;

namespace TinyCMS
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureCMS(IServiceCollection services)
        {
            InterfaceResolver.Instance.Add<IOrderArticle, OrderArticle>();

            var secretKey = Configuration["JWTSecret"];

            services.AddFileStorage();

            services.AddCommerceConfiguration((settings) =>
            {
                // change commerce settings here
            });

            services.AddCMSConfiguration((settings) =>
            {
                settings.JWTSettings = new JWTSettings(secretKey);
                settings.AddAssemblyWithNodes<CoNodes.SearchNode>();
                settings.AddAssemblyWithNodes<MWNodes.FAQ>();
                settings.AddAssemblyWithNodes<Question>();
                settings.AddAssemblyWithNodes<ResizImage>();
                settings.AddAssemblyWithNodes<Commerce.Nodes.Product>();

                JsonConvert.DefaultSettings = (() => new JsonSerializerSettings().ConfigureCmsSettings(settings.NodeFactoryInstance));

            });
            services.AddSingleton<NodeRestMiddleware>();
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureCMS(services);

            services.AddSingleton<IGraphQLPlugin,CommerceGraphQL>();
            services.AddTinyCMSGraphQL();
            services.AddResponseCompression();


            services.AddProxy()
                .AddSwaggerGen(c => { c.SwaggerDoc("v1", new Info { Title = "TinyCMS API", Version = "v1" }); })
                .AddSpaStaticFiles(config => { config.RootPath = "ReactClient/build"; });
            
            services.AddMvc()
                .AddJsonOptions(options =>
                    {
                        options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                        options.SerializerSettings.MaxDepth = 15;
                        options.SerializerSettings.Converters.Add(new StringEnumConverter
                        {
                            NamingStrategy = new CamelCaseNamingStrategy()
                        });
                        options.SerializerSettings.ObjectCreationHandling = ObjectCreationHandling.Replace;
                    }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
                app.UseHttpsRedirection();
            }
            app.UseResponseCompression();
            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "TinyCMS API V1"); });
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseSocketServer(serviceProvider);

            app.UseTinyCMSGraphQL();

            app.UseAuthentication();

            app.UseMiddleware<NodeRestMiddleware>();
            app.UseMiddleware<NodeSchemaMiddleware>();

            //app.UseProxy("/shopproxy", "https://www.bygglagret.se/Core.WebShop,Core.WebShop.ShopCommon.asmx");
            app.UseProxy("/cosearch", "https://cit-api-search-exp-stream01-qa-api.azurewebsites.net/api", new KeyValuePair<string,string>("X-ZUMO-APPLICATION", "MBzVPeguJZtQFDtrFohMjaHmwFQvYc30"));

            app.UseMvc();
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ReactClient";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
