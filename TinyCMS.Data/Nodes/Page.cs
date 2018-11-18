using System;
using System.ComponentModel;

namespace TinyCMS.Data.Nodes
{
    [Serializable, Description("A basic representation of a page")]
    public class Page : BaseNode
    {
        public override string Type => "page";
        public string Name { get; set; }
        public string Url { get; set; }
        public string TemplateId { get; set; }
    }

}
