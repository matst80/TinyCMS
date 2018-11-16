using System.Collections.ObjectModel;
using System.ComponentModel;

namespace TinyCMS.Commerce.Models
{
    public class ShopArticle : IShopArticleWithProperties
    {
        public ObservableCollection<IProperty> Properties { get; set; }
        public string Name { get; set; }
        public string ArticleNr { get; set; }
        public float Price { get; set; }
        public float Tax { get; set; }

        public event PropertyChangedEventHandler PropertyChanged;
    }
}
