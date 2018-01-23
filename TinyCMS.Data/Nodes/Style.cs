using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Style : BaseNode
    {
        public override string Type => "style";
        public string Name { get; set; }
        public string Css { get; set; }
    }
}
