using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Text : BaseNode
    {
        public override string Type => "text";
        public string Value { get; set; }
        public string Url { get; set; }
    }
}
