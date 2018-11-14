using System.Collections.Generic;
namespace TinyCMS.Commerce.Models
{
    public interface IShopArticleWithProperties<T> : IArticle where T : IProperty
    {
        IList<T> Properties { get; set; }
    }
}
