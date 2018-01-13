using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace TinyCMS.Data
{
    public interface INode
    {
        string Id { get; set; }
        string ParentId { get; set; }
        string Type { get; }
        IList<string> Tags { get; set; }
        ObservableCollection<INode> Children { get; set; }
    }
}
