using System;
using System.Collections.Generic;
using TinyCMS.Data.Nodes;

namespace TinyCMS.Data.Builder
{
    [Serializable]
    public class Container
    {
        public Container() {
            
        }

        public Container(INode node)
        {
            RootNode = node;
            ParseNode(node);
        }

        private void ParseNode(INode node)
        {
            if (Nodes.ContainsKey(node.Id))
                throw new NotUniqueIdException(node.Id);
            Nodes.Add(node.Id, node);
            if (node.Children != null)
            {
                foreach (var child in node.Children)
                {
                    ParseNode(child);
                }
            }
        }

        public INode RootNode { get; set; }

        public Dictionary<string, INode> Nodes { get; internal set; } = new Dictionary<string, INode>();

        public HashSet<IRelation> Relations { get; set; } = new HashSet<IRelation>();

        public INode GetById(string id)
        {
            if (Nodes.ContainsKey(id))
            {
                return Nodes[id];
            }
            return null;
        }

        public void AddRelation(INode from, INode to)
        {
            Relations.Add(new BaseRelation(from, to));
        }

        public IEnumerable<INode> GetRelations(INode node)
        {
            foreach (var rel in Relations)
            {
                if (rel.To == node)
                {
                    yield return rel.From;
                }
                else if (rel.From == node)
                {
                    yield return rel.To;
                }
            }
        }

        public IEnumerable<INode> GetRelationsById(string id)
        {
            var node = GetById(id);
            return GetRelations(node);
        }
    }
}
