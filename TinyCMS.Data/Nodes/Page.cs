using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Page : BaseNode
    {
        public override string Type => "page";
        public string Name { get; set; }
        public string Url { get; set; }
    }
}
