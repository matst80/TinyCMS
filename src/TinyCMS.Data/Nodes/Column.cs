using System;
using TinyCMS.Security;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Column : BaseNode
    {
        public override string Type => "col";
        public string ClassName { get; set; } = "col-3";
    }
}
