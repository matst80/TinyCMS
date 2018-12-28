using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using TinyCMS.Interfaces;
using TinyCMS.FileStorage;
using TinyCMS.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using TinyCMS.Base.Security;

namespace TinyCMS.Base
{
    public static class JsonSerializerSettingsExtensions
    {
        public static JsonSerializerSettings ConfigureCmsSettings(this JsonSerializerSettings settings, INodeTypeFactory factory)
        {
            settings.NullValueHandling = NullValueHandling.Ignore;
            settings.ObjectCreationHandling = ObjectCreationHandling.Replace;
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            settings.Converters.Add(new JsonNodeConverter(factory));
            settings.Converters.Add(new JsonMappedInterfaceConverter());
            return settings;
        }
    }

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCMSConfiguration(this IServiceCollection services, Action<TinyCmsOptions> options)
        {
            var settings = new TinyCmsOptions();
            options.Invoke(settings);
            return Setup(services, settings);

        }

        public static IServiceCollection AddCMSConfiguration(this IServiceCollection services, IOptions<TinyCmsOptions> options)
        {
            var settings = options.Value;
            return Setup(services, settings);

        }

        private static IServiceCollection AddSingletonMapped<T>(this IServiceCollection services, Type type)
        {
            return services.AddSingleton(type);
        }

        private static IServiceCollection Setup(IServiceCollection services, TinyCmsOptions settings)
        {
            var nodeFactory = settings.NodeFactoryInstance;

            services
                .AddSingleton<ITokenDecoder,TokenDecoder>()
                .AddSingleton(nodeFactory)
                .AddSingleton(typeof(IStorageService),settings.StorageService)
                .AddSingleton(settings.JWTSettings)
                .AddSingleton(typeof(INodeStorage),settings.NodeStorage)
                .AddSingleton(typeof(INodeSerializer),settings.NodeSerializer)
                .AddSingleton(typeof(ITokenValidator),settings.TokenValidator)
                .AddSingleton((sp) =>
                {
                    return sp.GetService<INodeStorage>().Load();
                });



            if (settings.UseAuthentication)
            {
                services.AddAuthentication(x =>
                 {
                     x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                     x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                 })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = settings.JWTSettings.GetSecurityKey(),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            }
            return services;
        }


    }
}
