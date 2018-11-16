using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System;
using System.ComponentModel;

namespace TinyCMS.Commerce.Models
{
    public class Product : IProduct
    {
        public Product()
        {
            Articles = new ObservableCollection<IShopArticleWithProperties>();
            Articles.CollectionChanged += Articles_CollectionChanged;
        }

        void Articles_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Articles)));
        }


        public string Model { get; set; }

        public ObservableCollection<IShopArticleWithProperties> Articles { get; set; }

        [field: NonSerialized]
        public event PropertyChangedEventHandler PropertyChanged;

        public IList<IProperty> GetAvailableProperties()
        {
            var ret = new List<IProperty>();
            foreach (var article in Articles)
            {
                ret.AddRange(article.Properties);
            }
            return ret;
        }

        public IList<IProperty> GetAvailableProperties(string key)
        {
            return GetAvailableProperties().Where(d => d.Key.Equals(key)).ToList();
        }

        public IList<string> GetAvailablePropertyTypes()
        {
            return GetAvailableProperties().Select(d => d.Key).Distinct().ToList();
        }

        public void Dispose()
        {
            Articles.CollectionChanged -= Articles_CollectionChanged;
        }
    }
}
