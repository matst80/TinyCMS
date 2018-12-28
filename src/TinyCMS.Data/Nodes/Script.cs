using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Script : BaseNode
    {
        public override string Type => "script";
        public string Name { get; set; }
        public string Code { get; set; }
    }
}
