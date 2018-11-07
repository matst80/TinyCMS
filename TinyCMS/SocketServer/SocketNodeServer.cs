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
using System.Linq;

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

                _container.OnValueChanged += (sender, e) =>
                {
                    if (webSocket.State == WebSocketState.Open)
                    {
                        if (sender is INode node && !result.CloseStatus.HasValue)
                        {
                            webSocket.SendAsync(_serializer.ToArraySegment(node, 0, 0, false), WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                    }
                };

                //_container.OnChildrenChanged += (sender, e) =>
                //{
                //    var firstChangedNode = e.NewItems.OfType<INode>().FirstOrDefault();
                //    if (firstChangedNode == null)
                //        firstChangedNode = e.OldItems.OfType<INode>().FirstOrDefault();

                //    var node = _container.GetById(firstChangedNode.ParentId);
                //    if (node!=null)
                //    {
                //        webSocket.SendAsync(_serializer.ToArraySegment(node, 1, 0, false), WebSocketMessageType.Text, true, CancellationToken.None);
                //    }
                //};


                if (request.Length > 1)
                {
                    var parsedRequest = new SocketRequest(request);

                    var returnData = _container.MatchRequest(parsedRequest, _factory);
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
