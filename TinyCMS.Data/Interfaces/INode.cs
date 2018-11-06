using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;

namespace TinyCMS.Data
{
    public interface INode
    {
        bool IsParsed { get; set; }
        string Id { get; set; }
        string ParentId { get; set; }
        string Type { get; }
        IList<string> Tags { get; set; }
        ObservableCollection<INode> Children { get; set; }
        event PropertyChangedEventHandler PropertyChanged;
    }
}
