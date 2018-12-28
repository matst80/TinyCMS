using System;
using TinyCMS.Data;

namespace TinyCMS.Nodes
{
    public class ThreeRenderer : BaseNode
    {
        public override string Type => "three-renderer";
        public int Width { get; set; } = 500;
        public int Height { get; set; } = 500;
    }

    public class Entity : BaseNode
    {
        public override string Type => "entity";
        public string Primitive { get; set; } = "a-box";
        public string Depth { get; set; }
        public string Position { get; set; }
        public string Rotation { get; set; }
        public string Radius { get; set; }
        public string Text { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public string Color { get; set; }
    }
}
