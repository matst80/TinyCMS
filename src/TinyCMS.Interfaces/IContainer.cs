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

        event EventHandler<PropertyChangedEventArgs> OnValueChanged;
        event EventHandler<NotifyCollectionChangedEventArgs> OnChildrenChanged;

        void AddRelation(INode from, INode to);
        void AfterRestore();
        INode GetById(string id);
        IEnumerable<INode> GetRelations(INode node);
        IEnumerable<INode> GetRelationsById(string id);
        void RemoveNode(INode item);
    }
}