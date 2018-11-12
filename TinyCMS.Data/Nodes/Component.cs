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

    [Serializable]
    public class Row : BaseNode
    {
        public override string Type => "row";
    }

    [Serializable]
    public class Column : BaseNode
    {
        public override string Type => "col";
        public string ClassName { get; set; } = "col-3";
    }
}
