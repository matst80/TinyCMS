using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Collections.Generic;

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

        public static IApplicationBuilder UseProxy(this IApplicationBuilder builder, string localUrl, string remoteUrl, params KeyValuePair<string,string>[] headers)
        {
            return builder.UseProxy(new ProxyOptions()
            {
                LocalUrl = localUrl,
                Destination = remoteUrl,
                HeadersToAppend = new Dictionary<string, string>(headers)
            });
        }
    }
}
