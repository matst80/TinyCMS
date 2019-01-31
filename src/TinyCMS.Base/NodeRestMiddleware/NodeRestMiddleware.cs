using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TinyCMS.Interfaces;
using IContainer = TinyCMS.Interfaces.IContainer;
using Newtonsoft.Json;
using System.IO;
using System.Collections.Generic;
using TinyCMS.Data.Extensions;
using System.Linq;

namespace TinyCMS.Base
{

    public class NodeRestMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JsonSerializer serializer;
        private readonly IContainer container;
        private readonly PathResolver pathResolver;
        private readonly INodeTypeFactory factory;
        private readonly INodeSerializer nodeSerializer;

        public NodeRestMiddleware(RequestDelegate next, IContainer container, INodeTypeFactory factory, INodeSerializer nodeSerializer)
        {
            this.factory = factory;
            this.nodeSerializer = nodeSerializer;
            this.container = container;
            pathResolver = new PathResolver(factory);
            _next = next;
            serializer = JsonSerializer.CreateDefault();
        }

        public async Task InvokeAsync(HttpContext context)
        {

            var query = pathResolver.Parse(context.Request.Path);

            if (query.IsHandled)
            {
                context.Response.ContentType = "application/json";
                string authToken = GetAuthorizarionToken(context);
                int depth = GetDepth(context.Request.Query);

                switch (context.Request.Method)
                {
                    case "PUT":
                        HandlePut(query, ParseBody(context.Request));
                        break;
                    case "DELETE":
                        HandleDelete(query);
                        break;
                    case "POST":
                        HandlePost(query, ParseBody(context.Request));
                        break;
                }

                var respone = (query.Id == null) ? (object)container.GetNodesByType(query.NodeType) : container.GetById(query.Id);

                if (respone == null)
                {
                    context.Response.StatusCode = 500;
                    respone = "No results found";
                }
                else
                {
                    context.Response.StatusCode = 200;
                }
                StreamResult(context, authToken, depth, respone);

                await context.Response.Body.FlushAsync();
            }
            else
            {
                await _next(context);
            }
        }

        private static int GetDepth(IQueryCollection query)
        {
            if (query.ContainsKey("depth"))
            {
                if (int.TryParse(query["depth"], out int queryDepth))
                {
                    return queryDepth;
                }
            }
            return 0;
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

        private void HandlePost(PathResult query, Dictionary<string, object> requestDictionary)
        {
            var parentId = query.Id;
            var nodeType = query.NodeType;

            if (requestDictionary.TryGetValue("parentId", out object dataParentId))
            {
                parentId = dataParentId.ToString();
            }

            if (nodeType == null)
            {
                if (requestDictionary.TryGetValue("type", out object dataType))
                {
                    nodeType = factory.GetTypeByName(dataType.ToString());
                }
            }

            var node = container.GetById(parentId);
            if (nodeType != null)
            {
                if (node != null)
                {
                    var newnode = Activator.CreateInstance(query.NodeType) as INode;
                    newnode.Apply(requestDictionary);
                    node.Add(newnode);
                    query.SetId(newnode.Id);
                }
                else
                {
                    throw new KeyNotFoundException("parentId");
                }
            }
            else
            {
                throw new KeyNotFoundException("type");
            }

        }

        private void HandleDelete(PathResult query)
        {
            var node = container.GetById(query.Id);
            if (node != null)
            {
                container.RemoveNode(node);
            }
        }

        private void HandlePut(PathResult query, Dictionary<string, object> requestDictionary)
        {
            var node = container.GetById(query.Id);
            if (node != null)
            {
                node.Apply(requestDictionary);
            }
        }

        private Dictionary<string, object> ParseBody(HttpRequest request)
        {
            using (var tr = new StreamReader(request.Body))
            {
                using (var jsonReader = new JsonTextReader(tr))
                {
                    return serializer.Deserialize<Dictionary<string, object>>(jsonReader);
                }
            }
        }
    }
}
