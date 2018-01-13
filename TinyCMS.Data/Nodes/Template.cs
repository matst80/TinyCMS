using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Template : BaseNode
    {
        public override string Type => "template";
        public string Name { get; set; }
        public string Html { get; set; }
    }
}
