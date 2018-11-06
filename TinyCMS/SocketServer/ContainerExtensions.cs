using System;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch.Helpers;
using System.Collections.Generic;
using TinyCMS.Data.Extensions;

namespace TinyCMS.SocketServer
{
    public static class ContainerExtensions
    {
        public static string GetString(this Dictionary<string, string> dict, string key, string resultIfEmpty = "")
        {
            if (dict != null)
            {
                if (dict.ContainsKey(key))
                    return dict[key];
            }
            return resultIfEmpty;
        }

        public static string GetString(this Dictionary<string, object> dict, string key, string resultIfEmpty = "")
        {
            if (dict != null)
            {
                if (dict.ContainsKey(key))
                    return dict[key].ToString();
            }
            return resultIfEmpty;
        }

        public static IRelation GetRelation(this INodeRequest request, Container container)
        {
            var fromId = request.QueryString.GetString("from");
            var toId = request.QueryString.GetString("to");
            INode from = container.GetById(fromId);
            INode to = container.GetById(toId);
            if (from != null && to != null)
            {
                return new BaseRelation(from, to);
            }
            return null;
        }

        public static INode RemoveNode(this INodeRequest request, Container container)
        {
            var nodeId = request.JsonData.GetString("id");
            if (!string.IsNullOrEmpty(nodeId))
            {
                var nodeToRemove = container.GetById(nodeId);
                container.RemoveNode(nodeToRemove);
                return nodeToRemove;
            }
            return null;
        }

        public static INode GetUpdatedNode(this INodeRequest request, Container container)
        {
            var nodeId = request.JsonData.GetString("id");
            if (!string.IsNullOrEmpty(nodeId)) {
                return container.GetById(nodeId).Apply(request.JsonData);
            }
            return null;
        }

        public static INode GetParent(this INodeRequest request, Container container)
        {
            var parentId = request.QueryString.GetString("parentId", request.JsonData.GetString("parentId"));
            return container.GetById(parentId) ?? container.RootNode;
        }

        public static INode GetNewNode(this INodeRequest request, Container container, NodeTypeFactory factory)
        {
            if (factory == null)
                throw new ArgumentException("Node type factory is needed to create new nodes", nameof(factory));
            var parent = request.GetParent(container);
            var type = request.QueryString.GetString("type", request.JsonData.GetString("type"));
            var newNode = factory.GetNew(type);
            parent.Add(newNode);
            return newNode;
        }

        public static INode MatchRequest(this Container cnt, INodeRequest request, NodeTypeFactory typeFactory)
        {
            INode ret = null;
            switch (request.RequestType)
            {
                case RequestTypeEnum.Get:
                    return cnt.GetById(request.Data);
                case RequestTypeEnum.Add:
                    return request.GetNewNode(cnt, typeFactory);
                case RequestTypeEnum.Update:
                    return request.GetUpdatedNode(cnt);
                case RequestTypeEnum.Remove:
                    return request.RemoveNode(cnt);
                case RequestTypeEnum.Link:
                    var rel = request.GetRelation(cnt);
                    if (rel != null)
                    {
                        cnt.AddRelation(rel.From, rel.To);
                        ret = rel.From;
                    }
                    break;
            }
            return ret;
        }
    }
}
