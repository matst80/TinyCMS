using System;
using Microsoft.Extensions.DependencyInjection;
using TinyCMS.Proxy;

namespace TinyCMS.Proxy
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProxy(this IServiceCollection services)
        {
            return services
                .AddSingleton<ProxyService>();
        }
    }
}
