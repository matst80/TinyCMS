using TinyCMS.Commerce.Models;
using System.Collections.Generic;
using System.Linq;
using System.Collections.ObjectModel;
using System;

namespace TinyCMS.Commerce.Services
{
    public abstract class ProductService : IProductService
    {
        public ProductService()
        {
            Products = new ObservableCollection<IProduct>();
            Products.CollectionChanged += Products_CollectionChanged;
        }

        void Products_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            Save(sender as IProduct);
        }

        internal abstract void Save(IProduct product);
        internal abstract void Load(string model);

        public ObservableCollection<IProduct> Products { get; internal set; }

        public IProduct GetProduct(string model)
        {
            var ret = Products.FirstOrDefault(d => d.Model.Equals(model));
            if (ret == null)
            {
                Load(model);
            }
            return ret;
        }


    }

}
