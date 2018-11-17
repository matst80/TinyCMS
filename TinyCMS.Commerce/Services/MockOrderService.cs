using System;
using TinyCMS.Commerce.Models;

namespace TinyCMS.Commerce.Services
{
    public class MockOrderService : OrderServiceBase
    {
        internal override void DeleteOrder(IOrder order)
        {

        }

        public override IOrder GetOrder(string id)
        {
            var ret= base.GetOrder(id);
            if (ret == null)
                ret = GetNewOrder();
            return ret;
        }

        internal override void SaveOrder(IOrder order)
        {

        }
    }

    public class MockArticleService : ArticleServiceBase
    {
        public override IArticle GetByArticleNr(string articleNr)
        {
            var ret = base.GetByArticleNr(articleNr);
            if (ret==null)
            {
                ret = ShopFactory.Instance.CreateInstance<IArticle>();
                ret.ArticleNr = articleNr;
            }
            return ret;
        }
    }

    public class MockProductService : ProductServiceBase
    {
        internal override void Load(string model)
        {

        }

        internal override void Save(IProduct product)
        {

        }
    }
}
