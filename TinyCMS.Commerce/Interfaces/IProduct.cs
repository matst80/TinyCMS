using System.Collections.Generic;
namespace TinyCMS.Commerce.Models
{
    public interface IProduct<T, I> where T : IShopArticleWithProperties<I> where I : IProperty
    {
        IList<T> Articles { get; set; }
        IList<I> GetAvailableProperties();
        IList<string> GetAvailablePropertyTypes();
        IList<I> GetAvailableProperties(string key);
    }
}
