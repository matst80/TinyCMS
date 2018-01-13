using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using TinyCMS.Data.Nodes;

namespace TinyCMS.Data.Builder
{
    [Serializable]
    public class Container
    {
        public Container()
        {

        }

        public Container(INode node)
        {
            RootNode = node;
            ParseNode(node);
        }

        public bool IsDirty { get; set; }

        private void ParseNode(INode node)
        {
            if (node == null || string.IsNullOrEmpty(node.Id))
                return;
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
            else
            {
                node.Children = new ObservableCollection<INode>();
            }
            AddWatchers(node);
        }

        private void AddWatchers(INode node)
        {
            node.Children.CollectionChanged += (sender, e) =>
            {
                if (e.Action == NotifyCollectionChangedAction.Add)
                {
                    foreach (var item in e.NewItems.OfType<INode>())
                    {
                        ParseNode(item);
                        IsDirty = true;
                    }
                }
                else if (e.Action == NotifyCollectionChangedAction.Remove)
                {
                    foreach (var item in e.OldItems.OfType<INode>())
                    {
                        RemoveNode(item);
                        IsDirty = true;
                    }
                }
            };
        }

        public void AfterRestore()
        {
            foreach (var node in Nodes.Values)
            {
                AddWatchers(node);
            }
        }

        public void RemoveNode(INode item)
        {
            // TODO Handle remove and fix children if needed
            Nodes.Remove(item.Id);
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
