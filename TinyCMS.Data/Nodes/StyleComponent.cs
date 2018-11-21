using System;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class StyleComponent : BaseNode
    {
        public override string Type => "stylednode";

        [EditorType("colorPicker")]
        public string BackgroundColor { get; set; }

        [EditorType("colorPicker")]
        public string Color { get; set; }

        public SizeUnit Padding { get; set; } = new SizeUnit();

        public SizeUnit Margin { get; set; } = new SizeUnit();
    }
}
