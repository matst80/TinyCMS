using System;
using System.Collections.Generic;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Component : BaseNode
    {
        public override string Type => "component";
        public string Name { get; set; }
        public Dictionary<string, object> Props { get; set; }
    }

}
