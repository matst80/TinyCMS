using System;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Threading;
using TinyCMS;
using TinyCMS.SocketServer;
using TinyCMS.Interfaces;
using System.Linq;
using System.Collections.Generic;
using System.IO;

public class SocketConnectionHandler
{
    private readonly IContainer container;
    private readonly WebSocket socket;
    private readonly INodeSerializer serializer;
    private readonly INodeTypeFactory factory;

    private bool IsOpen
    {
        get
        {
            return !socket.CloseStatus.HasValue;
        }
    }

    public SocketConnectionHandler(IContainer container, WebSocket socket, INodeSerializer serializer, INodeTypeFactory factory)
    {
        this.container = container;
        this.socket = socket;
        this.serializer = serializer;
        this.factory = factory;
        ConnectChangeHandlers();
        SendInitialData();
    }

    private void SendNode(INode node, int depth = 3)
    {

        if (IsOpen)
        {
            var dataToSend = serializer.ToArraySegment(node, CurrentToken, 3, 0, true);
            socket.SendAsync(dataToSend, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    private void SendInitialData()
    {
        SendNode(container.RootNode, 20);
    }

    private string CurrentToken { get; set; }

    public async Task ListenForCommands()
    {
        var buffer = new byte[1024 * 8];
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            ArraySegment<byte> segment = null;

            if (result.Count > 1)
            {
                var parsedRequest = new SocketRequest(buffer, result.Count);
                if (parsedRequest.RequestType == RequestTypeEnum.AuthToken)
                {
                    CurrentToken = parsedRequest.Data;
                }
                else
                {
                    var returnData = container.MatchRequest(parsedRequest, factory);
                    if (parsedRequest.QueryString.ContainsKey("oftype")) {
                        var nodeTypeToFind = factory.GetTypeByName(parsedRequest.QueryString["oftype"]);
                        if (nodeTypeToFind!=null)
                        {
                            var nodeArray = container.GetNodesByType(nodeTypeToFind, returnData);
                            SendNodeArray(nodeArray);
                            continue;
                        }
                    }
                    SendNode(returnData);
                }
            }

            result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }
        RemoveChangeAction();
        await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }

    private void SendNodeArray(IEnumerable<INode> result)
    {
        if (IsOpen)
        {
            var stream = new MemoryStream();
            serializer.WriteValue(stream, CurrentToken, result);
            var dataToSend = new ArraySegment<byte>();
            stream.TryGetBuffer(out dataToSend);

            socket.SendAsync(dataToSend, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    private void RemoveChangeAction()
    {
        container.OnValueChanged -= Container_OnValueChanged;
        container.OnChildrenChanged -= Container_OnChildrenChanged;
    }

    void Container_OnChildrenChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
    {
        string parentNodeId = string.Empty;
        foreach(var node in e.NewItems.OfType<INode>())
        {
            parentNodeId = node.ParentId;
            //if (IsOpen)
                //SendNode(node);
        }
        if (!string.IsNullOrEmpty(parentNodeId))
        {
            var parent = container.GetById(parentNodeId);
            if (parent != null && IsOpen)
                SendNode(parent);
        }
    }


    private void ConnectChangeHandlers()
    {
        container.OnValueChanged += Container_OnValueChanged;
        container.OnChildrenChanged += Container_OnChildrenChanged;
    }

    void Container_OnValueChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        if (IsOpen && sender is INode node)
        {
            SendNode(node);
        }
    }

}
