using System;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Collections.Generic;
using TinyCMS.Interfaces;

namespace TinyCMS
{

    public class SocketNodeServer
    {
        private INodeTypeFactory factory;
        private IContainer container;
        private INodeSerializer serializer;

        private List<SocketConnectionHandler> activeConnections = new List<SocketConnectionHandler>();

        public SocketNodeServer(IContainer cnt, INodeTypeFactory factory, INodeSerializer ser)
        {
            this.factory = factory;
            this.container = cnt;
            this.serializer = ser;
        }

        public async Task HandleNodeRequest(HttpContext context, WebSocket webSocket)
        {
            var connection = new SocketConnectionHandler(container, webSocket, serializer, factory);
            activeConnections.Add(connection);
            Console.WriteLine("Connection made");
            await connection.ListenForCommands();
            Console.WriteLine("Connection lost");
            activeConnections.Remove(connection);
        }
    }
}
