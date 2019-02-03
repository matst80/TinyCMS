using System;
using System.ComponentModel;
using TinyCMS.Interfaces;
using System.Diagnostics;

namespace TinyCMS
{
    public class ConsoleChangeEvent : IChangeEvent
    {
        public ConsoleChangeEvent(long count)
        {
            TimeStamp = DateTime.Now;
            Id = count.ToString();
        }

        public DateTime TimeStamp { get; set; }

        public string Id { get; set; }
    }

    public class ConsoleChangeHandler : IContainerChangeHandler
    {
        private long counter = 0;

        public ConsoleChangeHandler()
        {

        }

        public IChangeEvent OnNodeAdded(INode node)
        {
            Debug.WriteLine($"Node added id:{node.Id}, parentId:{node.ParentId}, type:{node.Type}");
            return new ConsoleChangeEvent(counter++);
        }

        public IChangeEvent OnNodeChanged(INode node, PropertyChangedEventArgs changeArgs)
        {
            Debug.WriteLine($"Node changed property:{changeArgs.PropertyName} on {node.Id}");
            return new ConsoleChangeEvent(counter++);
        }

        public IChangeEvent OnNodeDeleted(INode node)
        {
            Debug.WriteLine($"Node deleted:{node.Id}, parentId:{node.ParentId}, type:{node.Type}");
            return new ConsoleChangeEvent(counter++);
        }

        public IChangeEvent OnNodeReplaced(INode oldNode, INode newNode)
        {
            Debug.WriteLine($"Node replaced:{oldNode.Id}, with:{newNode.Id}");
            return new ConsoleChangeEvent(counter++);
        }
    }

    public class FileChangeHandler : IContainerChangeHandler
    {
        private long counter = 0;

        public FileChangeHandler()
        {

        }

        public IChangeEvent OnNodeAdded(INode node)
        {
            Debug.WriteLine($"Node added id:{node.Id}, parentId:{node.ParentId}, type:{node.Type}");
            return new ConsoleChangeEvent(counter++);
        }

        public IChangeEvent OnNodeChanged(INode node, PropertyChangedEventArgs changeArgs)
        {
            Debug.WriteLine($"Node changed property:{changeArgs.PropertyName} on {node.Id}");
            return new ConsoleChangeEvent(counter++);
        }

        public IChangeEvent OnNodeDeleted(INode node)
        {
            Debug.WriteLine($"Node deleted:{node.Id}, parentId:{node.ParentId}, type:{node.Type}");
            return new ConsoleChangeEvent(counter++);
        }

        public IChangeEvent OnNodeReplaced(INode oldNode, INode newNode)
        {
            Debug.WriteLine($"Node replaced:{oldNode.Id}, with:{newNode.Id}");
            return new ConsoleChangeEvent(counter++);
        }
    }
}
