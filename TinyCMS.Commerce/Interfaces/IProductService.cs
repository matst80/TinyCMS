using TinyCMS.Commerce.Models;
using System.Collections.Generic;
using System.Collections.ObjectModel;
namespace TinyCMS.Commerce.Services
{
    public interface IProductService
    {
        ObservableCollection<IProduct> Products { get; }
        IProduct GetProduct(string model);
    }

}
