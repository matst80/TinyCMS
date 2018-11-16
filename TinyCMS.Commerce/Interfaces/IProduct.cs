using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System;

namespace TinyCMS.Commerce.Models
{
    public interface IProduct : INotifyPropertyChanged, IDisposable
    {
        string Model { get; set; }
        ObservableCollection<IShopArticleWithProperties> Articles { get; set; }
        IList<IProperty> GetAvailableProperties();
        IList<IProperty> GetAvailableProperties(string key);
        IList<string> GetAvailablePropertyTypes();
    }
}
