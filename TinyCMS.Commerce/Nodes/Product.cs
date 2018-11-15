using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using Newtonsoft.Json;
using TinyCMS.Commerce.Models;
using TinyCMS.Data;
using TinyCMS.Interfaces;

namespace TinyCMS.Commerce.Nodes
{
    [Serializable]
    public class Product : Models.Product
    {
        public string Id { get; set; }

        [JsonIgnore]
        public string ParentId { get; set; }

        [JsonIgnore]
        public bool IsParsed { get; set; }

        public string Type => "nodeproduct";

        [SchemaType("tags", false)]
        public IList<string> Tags { get; set; }

        [SchemaType("children")]
        public ObservableCollection<INode> Children { get; set; } = new ObservableCollection<INode>();

        [field: NonSerialized]
        public event PropertyChangedEventHandler PropertyChanged;
    }
}
