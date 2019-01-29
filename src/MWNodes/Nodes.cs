using System;
using System.Collections.Generic;
using TinyCMS.Data;

namespace MWNodes
{
    public class FAQ : BaseNode
    {
        public override string Type => "faq";
        public string Question { get; set; }
        public string Answer { get; set; }
    }

    public class FAQCategory : BaseNode
    {
        public override string Type => "faqcategory";
        public string Name { get; set; }
        public string Description { get; set; }
    }


    public class Translation : BaseNode
    {
        public override string Type => "translation";
        public string Key { get; set; }
        public string Value { get; set; }
        public string Mimetype { get; set; } = "text/html";
    }

    public class YanziMapping : BaseNode
    {
        public override string Type => "mapping";
        public string UDID { get; set; }
    }

    public class Contract : BaseNode
    {
        public override string Type => "contract";
        public string ContractName { get; set; }
        public string Code { get; set; }
    }

    public class ContractSite : Contract
    {
        public override string Type => "contractsite";
        public string Name { get; set; }
    }

    public class SiteModel : BaseNode
    {
        public override string Type => "sitemodel";
    }

    public class LunchRestaurant : BaseNode
    {
        public string Url { get; set; }

        public List<LunchMenu> Menu { get; set; }

        public override string Type => "restaurant";

        public class LunchMenu
        {
        }
    }
}
