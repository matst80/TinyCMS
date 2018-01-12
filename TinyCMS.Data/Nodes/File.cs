using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class File : BaseNode
    {
        public override string Type => "file";
        public string Path { get; set; }
        public string Url { get; set; }
    }
}
