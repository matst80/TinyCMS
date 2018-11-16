using System;
using TinyCMS.Commerce.Services;

namespace TinyCMS.Commerce
{
    public interface IFactory
    {
        IOrderService OrderService { get; }
        IProductService ProductService { get; }
        IArticleService ArticleService { get; }

        T CreateInstance<T>();
        object CreateInstance(Type type);
    }
}