using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;

namespace TinyCMS.Interfaces
{
    public interface INode : INotifyPropertyChanged
    {
        bool IsParsed { get; set; }
        string Id { get; set; }
        string ParentId { get; set; }
        string Type { get; }
        //bool Published { get; set; }
        IList<string> Tags { get; set; }
        ObservableCollection<INode> Children { get; set; }
    }

    public interface ITinyPlugin
    {

    }


}
