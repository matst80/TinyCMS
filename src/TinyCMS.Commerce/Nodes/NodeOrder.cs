using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Newtonsoft.Json;
using TinyCMS.Interfaces;

namespace TinyCMS.Commerce.Nodes
{
    [Serializable]
    public class NodeOrder : Models.Order, INode
    {
        [JsonIgnore]
        public bool IsParsed { get; set; }
        public string ParentId { get; set; }

        public string Type => "nodeorder";

        public IList<string> Tags { get; set; }

        public ObservableCollection<INode> Children { get; set; } = new ObservableCollection<INode>();
    }
}
