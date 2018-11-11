using System;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using TinyCMS.Data.Extensions;
using TinyCMS.Interfaces;

namespace TinyCMS.SocketServer
{
    public static class NodeRequestExtensions
    {
        public static IRelation GetRelation(this INodeRequest request, IContainer container)
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

        public static INode RemoveNode(this INodeRequest request, IContainer container)
        {
            var nodeId = request.JsonData.GetString("id");
            if (!string.IsNullOrEmpty(nodeId))
            {
                var nodeToRemove = container.GetById(nodeId);
                var parent = container.GetById(nodeToRemove.ParentId);
                container.RemoveNode(nodeToRemove);
                return parent;
            }
            return null;
        }

        public static INode GetUpdatedNode(this INodeRequest request, IContainer container)
        {
            var nodeId = request.JsonData.GetString("id");
            if (!string.IsNullOrEmpty(nodeId))
            {
                return container.GetById(nodeId).Apply(request.JsonData);
            }
            return null;
        }

        public static INode GetParent(this INodeRequest request, IContainer container)
        {
            var parentId = request.QueryString.GetString("parentId", request.JsonData.GetString("parentId"));
            return container.GetById(parentId) ?? container.RootNode;
        }

        public static INode GetNewNode(this INodeRequest request, IContainer container, INodeTypeFactory factory)
        {
            if (factory == null)
                throw new ArgumentException("Node type factory is needed to create new nodes", nameof(factory));
            var parent = request.GetParent(container);
            var type = request.QueryString.GetString("type", request.JsonData.GetString("type"));
            var newNode = factory.GetNew(type);
            if (request.JsonData != null)
            {
                newNode.Apply(request.JsonData);
            }
            parent.Add(newNode);
            return newNode;
        }
    }
}
