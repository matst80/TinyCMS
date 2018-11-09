using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class File : BaseNode
    {
        public override string Type => "file";
        [EditorType("route")]
        public string Path { get; set; }
        [EditorType("url")]
        public string Url { get; set; }
    }
}
