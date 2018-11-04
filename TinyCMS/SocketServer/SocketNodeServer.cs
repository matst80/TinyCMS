using System;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Threading;
using System.Text;
using TinyCMS.Data.Builder;
using TinyCMS.Controllers;
using TinyCMS.Data;
using System.IO;
using TinyCMS;
using TinyCMS.SocketServer;

namespace TinyCMS
{

    public class SocketNodeServer
    {
        private NodeTypeFactory _factory;
        private Container _container;
        private NodeSerializer _serializer;

        public SocketNodeServer(Container cnt, NodeTypeFactory factory, NodeSerializer ser)
        {
            this._factory = factory;
            this._container = cnt;
            this._serializer = ser;
        }

        public async Task HandleNodeRequest(HttpContext context, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                var request = Encoding.UTF8.GetString(buffer, 0, result.Count);
                ArraySegment<byte> segment = null;
                if (request.Length > 1)
                {
                    var parsedRequest = new SocketRequest(request);
                    var returnData = _container.MatchRequest(parsedRequest);
                    segment = _serializer.ToArraySegment(returnData, 3, 0, true);
                }
                if (segment == null)
                    segment = _serializer.ToArraySegment(_container.RootNode, 3, 0, true);
                await webSocket.SendAsync(segment, result.MessageType, result.EndOfMessage, CancellationToken.None);

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }
}
