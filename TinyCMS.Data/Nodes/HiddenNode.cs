using System;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class HiddenNode : BaseNode
    {
        public override string Type => "hidden";
    }
}
