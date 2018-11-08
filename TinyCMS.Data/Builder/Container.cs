using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.ComponentModel;

namespace TinyCMS.Data.Builder
{
    [Serializable]
    public class Container
    {
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
            {
                if (!node.IsParsed)
                    throw new NotUniqueIdException(node.Id);
            }
            else Nodes.Add(node.Id, node);

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
            if (!node.IsParsed)
                AddWatchers(node);
            node.IsParsed = true;

        }

        [field:NonSerialized]
        public event EventHandler<PropertyChangedEventArgs> OnValueChanged;

        [field: NonSerialized]
        public event EventHandler<NotifyCollectionChangedEventArgs> OnChildrenChanged;

        private void AddWatchers(INode node)
        {
            node.PropertyChanged += (sender, e) =>
            {
                IsDirty = true;
                OnValueChanged?.Invoke(sender, e);
            };
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
                OnChildrenChanged?.Invoke(sender, e);
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
            var parentId = Nodes[item.Id].ParentId;
            if (!string.IsNullOrEmpty(parentId))
            {
                var parent = Nodes[parentId];
                parent.Children.Remove(item);
            }
            Nodes.Remove(item.Id);
            IsDirty = true;
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
