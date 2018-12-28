using System;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace TinyCMS.Proxy
{
    public class ProxyMiddleware
    {
        readonly ProxyOptions options;
        readonly RequestDelegate next;

        public ProxyMiddleware(RequestDelegate next, IOptions<ProxyOptions> options)
        {
            this.next = next;
            this.options = options.Value;
        }

        public Task Invoke(HttpContext context)
        {
            var localPath = context.Request.Path;
            if (localPath.StartsWithSegments(options.LocalUrl))
            {
                var newUrl = localPath.ToString().Replace(options.LocalUrl, options.Destination);

                var uri = new Uri(newUrl);
                return context.ProxyRequest(uri);
            }
            else
                return next(context);
        }
    }
}
