using System;
using TinyCMS.Commerce.Services;
using TinyCMS.Commerce.Models;

namespace TinyCMS.Commerce
{
    public interface IShopFactory
    {
        IOrderService OrderService { get; }
        IProductService ProductService { get; }
        IArticleService ArticleService { get; }

        T CreateInstance<T>();
        object CreateInstance(Type type);
    }
}