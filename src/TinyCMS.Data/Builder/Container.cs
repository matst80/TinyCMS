using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using Newtonsoft.Json;
using TinyCMS.Interfaces;

namespace TinyCMS.Data.Builder
{
    //public class NodeDependencyResover : IDependencyResolver
    //{

    //}

    [Serializable]
    public class Container : IContainer
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

        private void ParseNode(INode node, string parentId="")
        {

            if (node == null || string.IsNullOrEmpty(node.Id))
                return;
            if (!string.IsNullOrEmpty(parentId) && node.ParentId != parentId)
                node.ParentId = parentId;
            if (Nodes.ContainsKey(node.Id))
            {
                if (!node.IsParsed)
                    throw new NotUniqueIdException(node.Id);
            }
            else 
                Nodes.Add(node.Id, node);

            if (node.Children != null)
            {
                foreach (var child in node.Children)
                {
                    ParseNode(child, node.Id);
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
        public event EventHandler<System.ComponentModel.PropertyChangedEventArgs> OnValueChanged;

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
                        ParseNode(item,node.Id);
                        IsDirty = true;
                    }
                }
                else if (e.Action == NotifyCollectionChangedAction.Remove)
                {
                    foreach (var item in e.OldItems.OfType<INode>())
                    {
                        //RemoveNode(item);
                        IsDirty = true;
                    }
                }
                OnChildrenChanged?.Invoke(sender, e);
            };
        }

        public void AfterRestore()
        {
            RootNode.Id = "root";
            Nodes.Add("root", RootNode);
            AddWatchers(RootNode);

            foreach (var node in RootNode.Children)
            {
                ParseNode(node, "root");
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

        [JsonIgnore]
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
            Relations.Add(new BaseRelation(from.Id, to.Id));
        }

        public IEnumerable<INode> GetRelations(INode node)
        {
            foreach (var rel in Relations)
            {
                if (rel.ToId.Equals(node.Id))
                {
                    yield return GetById(rel.FromId);
                }
                else if (rel.FromId.Equals(node.Id))
                {
                    yield return GetById(rel.ToId);
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
