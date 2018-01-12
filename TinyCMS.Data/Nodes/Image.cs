using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Image : File
    {
        public override string Type => "image";
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
