using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace TinyCMS.Commerce.Models
{
    public interface IShopArticleWithProperties : IArticle
    {
        ObservableCollection<IProperty> Properties { get; set; }
    }
}
