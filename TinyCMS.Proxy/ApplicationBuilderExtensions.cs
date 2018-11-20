using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;

namespace TinyCMS.Proxy
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseProxy(this IApplicationBuilder builder, ProxyOptions options)
        {
            return builder.UseMiddleware<ProxyMiddleware>(Options.Create(options));
        }

        public static IApplicationBuilder UseProxy(this IApplicationBuilder builder, string localUrl, string remoteUrl)
        {
            return builder.UseProxy(new ProxyOptions()
            {
                LocalUrl = localUrl,
                Destination = remoteUrl
            });
        }
    }
}
