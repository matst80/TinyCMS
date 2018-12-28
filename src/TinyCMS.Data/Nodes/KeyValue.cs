using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class KeyValue : BaseNode
    {
        public override string Type => "keyvalue";
        public string Key { get; set; }
        public object Value { get; set; }
    }
}
