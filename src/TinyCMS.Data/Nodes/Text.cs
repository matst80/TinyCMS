using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Text : BaseNode
    {
        public override string Type => "text";

        [EditorType("multiline")]
        public string Value { get; set; } = "<p>Insert text here</p>";
    }

    [Serializable]
    public class Header : BaseNode
    {
        public override string Type => "h1";

        public string Text { get; set; }

    }

    [Serializable]
    public class CodeNode : BaseNode
    {
        public override string Type => "code";

        public string CodeLang { get; set; } = "javascript";

        [EditorType("multiline")]
        public string Code { get; set; } = "function test() { console.log(arguments}; }";

    }
}
