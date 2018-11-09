using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Text : BaseNode
    {
        public override string Type => "text";
        [EditorType("multiline")]
        public string Value { get; set; }
        [EditorType("url")]
        public string Url { get; set; }
    }

    [Serializable]
    public class TempSub
    {

        public string Value { get; set; }
        public int Sklep { get; set; }

    }

    [Serializable]
    public class TempObject : BaseNode
    {
        public override string Type => "text";
        public TempSub Temp { get; set; }
    }
}
