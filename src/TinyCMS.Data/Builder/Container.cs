using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using TinyCMS.Data.Extensions;
using TinyCMS.Interfaces;
using System.ComponentModel.Design;

namespace TinyCMS.Data.Builder
{
    //public class NodeDependencyResover : IDependencyResolver
    //{

    //}

    [Serializable]
    public class Container : IContainer
    {
        private IContainerChangeHandler changeHandler;

        public Container()
        {

        }

        public Container(INode node)
        {
            RootNode = node;
            ParseNode(node);
        }

        public bool IsDirty { get; set; }

        private void ParseNode(INode node, string parentId = "")
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

        [field: NonSerialized]
        public event EventHandler<System.ComponentModel.PropertyChangedEventArgs> OnValueChanged;

        [field: NonSerialized]
        public event EventHandler<NotifyCollectionChangedEventArgs> OnChildrenChanged;

        private void AddWatchers(INode node)
        {
            node.PropertyChanged += (sender, e) =>
            {
                if (e.PropertyName != "IsParsed")
                {
                    IsDirty = true;
                    changeHandler?.OnNodeChanged(node, e);
                    OnValueChanged?.Invoke(sender, e);
                }
            };
            node.Children.CollectionChanged += (sender, e) =>
            {
                IsDirty = true;
                if (e.Action == NotifyCollectionChangedAction.Add || e.Action == NotifyCollectionChangedAction.Replace && e.NewItems != null)
                {
                    foreach (var item in e.NewItems.OfType<INode>().ToList())
                    {
                        if (item != null)
                        {
                            ParseNode(item, node.Id);
                            changeHandler?.OnNodeAdded(node);
                        }
                    }
                }

                if (e.Action == NotifyCollectionChangedAction.Remove || e.Action == NotifyCollectionChangedAction.Replace && e.OldItems != null)
                {
                    foreach (var item in e.OldItems.OfType<INode>().ToList())
                    {
                        if (item!=null)
                            changeHandler?.OnNodeDeleted(item);
                    }

                }
                if (e.Action == NotifyCollectionChangedAction.Reset && e.OldItems != null)
                {
                    foreach (var item in e.OldItems.OfType<INode>().ToList())
                    {
                        if (item!=null)
                            changeHandler?.OnNodeDeleted(item);
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

        public IEnumerable<T> GetNodesOfType<T>(INode parent = null) where T : INode
        {
            if (parent == null)
            {
                return Nodes.Values.OfType<T>();
            }
            return parent.FindByType<T>();
        }

        public IEnumerable<INode> GetNodesByTag(string tag)
        {
            return Nodes.Values.Where(d => d.Tags.Contains(tag));
        }

        public IEnumerable<INode> GetNodesByType(Type type, INode parent = null)
        {
            MethodInfo method = this.GetType().GetMethod("GetNodesOfType");
            MethodInfo generic = method.MakeGenericMethod(type);
            var ret = generic.Invoke(this, new[] { parent });
            return ret as IEnumerable<INode>;
        }

        public void AttachChangeLogger(IContainerChangeHandler logger)
        {
            changeHandler = logger;
        }
    }
}
