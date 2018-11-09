using System;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using TinyCMS.Controllers;
using TinyCMS.Data.Builder;

namespace TinyCMS.SocketServer
{
    public static class ApplicationBuilderExtensions
    {
        public static void UseSocketServer(this IApplicationBuilder app, IServiceProvider serviceProvider)
        {
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 4 * 1024
            };
            app.UseWebSockets(webSocketOptions);

            var container = serviceProvider.GetService(typeof(Container)) as Container;
            var nodeTypeFactory = serviceProvider.GetService(typeof(NodeTypeFactory)) as NodeTypeFactory;

            SocketNodeServer server = new SocketNodeServer(container, nodeTypeFactory, new NodeSerializer(container));
            app.Use(async (context, next) =>
            {
                if (context.Request.Path == "/ws")
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                        await server.HandleNodeRequest(context, webSocket);
                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                    }
                }
                else
                {
                    await next();
                }

            });
        }
    }
}
