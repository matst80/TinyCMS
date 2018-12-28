using System;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Builder;
using TinyCMS.Interfaces;

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

            var container = serviceProvider.GetService(typeof(IContainer)) as IContainer;
            var nodeTypeFactory = serviceProvider.GetService(typeof(INodeTypeFactory)) as INodeTypeFactory;
            var nodeSerializer = serviceProvider.GetService(typeof(INodeSerializer)) as INodeSerializer;

            SocketNodeServer server = new SocketNodeServer(container, nodeTypeFactory, nodeSerializer);
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
