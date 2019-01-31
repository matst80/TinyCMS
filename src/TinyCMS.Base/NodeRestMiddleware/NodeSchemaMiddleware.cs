using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TinyCMS.Interfaces;
using System.Linq;

namespace TinyCMS.Base
{

    public class NodeSchemaMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly PathResolver pathResolver;
        private readonly INodeTypeFactory factory;
        private readonly INodeSerializer nodeSerializer;

        public NodeSchemaMiddleware(RequestDelegate next, INodeTypeFactory factory, INodeSerializer nodeSerializer)
        {
            this.factory = factory;
            this.nodeSerializer = nodeSerializer;

            pathResolver = new PathResolver(factory, "nodeschema", true, true);
            _next = next;

        }

        public async Task InvokeAsync(HttpContext context)
        {

            var query = pathResolver.Parse(context.Request.Path);

            if (query.IsHandled && context.Request.Method.Equals("GET"))
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 200;

                string authToken = GetAuthorizarionToken(context);


                if (query.NodeType != null)
                {
                    nodeSerializer.StreamSchema(query.NodeType, authToken, context.Response.Body);
                }
                else
                {
                    nodeSerializer.WriteValue(context.Response.Body, authToken, factory.RegisterdTypeNames());
                }

                await context.Response.Body.FlushAsync();
            }
            else
            {
                await _next(context);
            }
        }

        private void StreamResult(HttpContext context, string authToken, int depth, object respone)
        {
            if (respone is INode node)
            {
                nodeSerializer.StreamSerialize(node, authToken, context.Response.Body, depth, 0);
            }
            else
            {
                nodeSerializer.WriteValue(context.Response.Body, authToken, respone);
            }
        }

        private string GetAuthorizarionToken(HttpContext context)
        {
            string authToken = string.Empty;

            if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                if (authHeader.LastOrDefault() is string authKey)
                {
                    return authKey;
                }
            }

            return string.Empty;
        }
    }
}
