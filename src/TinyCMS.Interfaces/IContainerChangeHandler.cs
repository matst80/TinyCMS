using System.ComponentModel;
using System;

namespace TinyCMS.Interfaces
{
    public interface IContainerRevertHandler : IContainerChangeHandler
    {
        bool RevertTo(IChangeEvent changeEvent);
    }

    public interface IChangeEvent
    {
        DateTime TimeStamp { get; }
        string Id { get; }
    }

    public interface IContainerChangeHandler
    {
        IChangeEvent OnNodeDeleted(INode node);
        IChangeEvent OnNodeReplaced(INode oldNode, INode newNode);
        IChangeEvent OnNodeAdded(INode node);
        IChangeEvent OnNodeChanged(INode node, PropertyChangedEventArgs propertyChangedEventArgs);
    }
}