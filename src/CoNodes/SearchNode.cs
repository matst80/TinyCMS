using System;
using TinyCMS.Data;

namespace CoNodes
{
    public class SearchNode : BaseNode
    {
        public override string Type => "cosearch";
        public int Noi { get; set; } = 100;
    }
}
