using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using Newtonsoft.Json;
using PropertyChanged;

namespace TinyCMS.Data
{
    [Serializable]
    public abstract class BaseNode : INode, INotifyPropertyChanged
    {
        public string Id { get; set; }
        [JsonIgnore]
        public string ParentId { get; set; }
        [JsonIgnore]
        public bool IsParsed { get; set; }
        public abstract string Type { get; }
        public IList<string> Tags { get; set; }
        public ObservableCollection<INode> Children { get; set; }

        [field: NonSerialized]
        public event PropertyChangedEventHandler PropertyChanged;
    }

    [Serializable]
    public class BaseRelation : IRelation, IEqualityComparer<IRelation>
    {
        public BaseRelation(INode from, INode to)
        {
            From = from;
            To = to;
        }

        public INode From { get; set; }
        public INode To { get; set; }

        public bool Equals(IRelation x, IRelation y)
        {
            return (x.From == y.From && x.To == y.To) ||
                (x.From == y.To && x.To == y.From);
        }

        public int GetHashCode(IRelation obj)
        {
            return base.GetHashCode();
        }
    }
}
