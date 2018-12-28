using System;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class SizeUnit
    {
        public int Top { get; set; }
        public int Left { get; set; }
        public int Right { get; set; }
        public int Bottom { get; set; }
    }
}
