using System;
using TinyCMS.Commerce.Services;

namespace TinyCMS.Commerce
{
    public class ShopFactory : IShopFactory
    {
        private readonly IServiceProvider provider;

        public ShopFactory(IServiceProvider provider)
        {
            this.provider = provider;
            ShopFactory.Instance = this;
        }

        public static ShopFactory Instance { get; set; }

        public T CreateInstance<T>()
        {
            return (T)provider.GetService(typeof(T));
        }

        public object CreateInstance(Type type)
        {
            return provider.GetService(type);
        }

        private IProductService productService;
        public IProductService ProductService
        {
            get
            {
                if (productService == null)
                    productService = CreateInstance<IProductService>();
                return productService;
            }
        }

        private IOrderService orderService;
        public IOrderService OrderService
        {
            get
            {
                if (orderService == null)
                    orderService = CreateInstance<IOrderService>();
                return orderService;
            }
        }

        private IArticleService articleService;
        public IArticleService ArticleService
        {
            get
            {
                if (articleService == null)
                    articleService = CreateInstance<IArticleService>();
                return articleService;
            }
        }
    }
}
