using System;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Site : BaseNode
    {
        public override string Type => "site";
        public string Domain { get; set; }
    }

}
