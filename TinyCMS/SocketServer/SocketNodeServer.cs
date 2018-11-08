using System;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Text;
using TinyCMS.Data.Builder;
using TinyCMS.Controllers;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;

namespace TinyCMS
{

    public class SocketNodeServer
    {
        private NodeTypeFactory factory;
        private Container container;
        private NodeSerializer serializer;

        private List<SocketConnectionHandler> activeConnections = new List<SocketConnectionHandler>();

        public SocketNodeServer(Container cnt, NodeTypeFactory factory, NodeSerializer ser)
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
