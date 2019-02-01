using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using TinyCMS.Interfaces;

namespace TinyCMS.Interfaces
{
    public interface IContainer
    {
        bool IsDirty { get; set; }
        INode RootNode { get; set; }
        Dictionary<string, INode> Nodes { get; }
        HashSet<IRelation> Relations { get; set; }

        void AttachChangeLogger(IContainerChangeHandler logger);

        event EventHandler<PropertyChangedEventArgs> OnValueChanged;
        event EventHandler<NotifyCollectionChangedEventArgs> OnChildrenChanged;

        IEnumerable<T> GetNodesOfType<T>(INode parent = null) where T : INode;
        IEnumerable<INode> GetNodesByType(Type type, INode parent = null);
        IEnumerable<INode> GetNodesByTag(string tag);

        void AddRelation(INode from, INode to);
        void AfterRestore();
        INode GetById(string id);
        IEnumerable<INode> GetRelations(INode node);
        IEnumerable<INode> GetRelationsById(string id);
        void RemoveNode(INode item);
    }
}