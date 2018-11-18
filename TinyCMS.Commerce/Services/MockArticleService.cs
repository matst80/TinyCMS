using TinyCMS.Commerce.Models;

namespace TinyCMS.Commerce.Services
{
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
}
