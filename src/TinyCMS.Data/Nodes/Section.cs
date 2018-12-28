using System;
namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Section : BaseNode
    {
        public override string Type => "section";
        public string Title { get; set; }
        public string Ingress { get; set; }
    }
}
