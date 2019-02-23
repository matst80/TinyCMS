using System;
using TinyCMS.Data;

namespace TinyCMS.Nodes
{
    public class ThreeRenderer : BaseNode
    {
        public override string Type => "threerenderer";
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

    public class Post : BaseNode
    {
        public string Title { get; set; } = "Blogpost";

        public override string Type => "post";

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime Edited { get; set; }

        public string AuthorName { get; set; } = "Mats Törnberg";
    }

    public class GistEmbed : BaseNode
    {
        public override string Type => "gist";

        public string Gist { get; set; } = "matst80/e100d38ff39383acb3ad5dd4ef7bb28d";
    }
}
