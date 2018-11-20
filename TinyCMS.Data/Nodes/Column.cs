using System;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Column : BaseNode
    {
        public override string Type => "col";
        public string ClassName { get; set; } = "col-3";
    }

    public class CustomForm : BaseNode {
        public override string Type => "customform";
             
    }
}
