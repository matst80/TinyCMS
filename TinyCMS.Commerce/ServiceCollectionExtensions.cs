using System;
using Microsoft.Extensions.DependencyInjection;
using TinyCMS.Commerce.Models;
using TinyCMS.Commerce.Nodes;
using TinyCMS.Commerce.Services;

namespace TinyCMS.Commerce
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCommerceConfiguration(this IServiceCollection services, Action<TinyShopOptions> options)
        {
            var settings = new TinyShopOptions();
            options.Invoke(settings);
            return SetupCommerce(services, settings);

        }

        private static IServiceCollection SetupCommerce(IServiceCollection services, TinyShopOptions settings)
        {
            services
               .AddSingleton(typeof(IShopFactory), settings.ShopFactory)
               .AddTransient(typeof(IOrder), settings.OrderType)
               .AddTransient(typeof(IArticle), settings.ShopArticleType)
               .AddTransient(typeof(IShopArticleWithProperties), settings.ShopArticleWithPropertiesType)
               .AddTransient(typeof(IOrderArticle), settings.OrderArticleType)
               .AddSingleton(typeof(IOrderService), settings.OrderService)
               .AddSingleton(typeof(IArticleService), settings.ArticleService)
               .AddSingleton(typeof(IProductService), settings.ProductService);

            return services;
        }
    }
}
