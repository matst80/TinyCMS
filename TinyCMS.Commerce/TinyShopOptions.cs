using System;
using TinyCMS.Data.Builder;
using TinyCMS.Interfaces;
using System.Collections.Generic;
using System.Reflection;
using TinyCMS.Data;
using TinyCMS.FileStorage;
using TinyCMS.Serializer;
using TinyCMS.Security;
using TinyCMS.Commerce.Models;
using TinyCMS.Commerce.Nodes;
using TinyCMS.Commerce.Services;

namespace TinyCMS.Commerce
{
    public class TinyShopOptions
    {
        public Type ShopFactory { get; set; } = typeof(ShopFactory);
        public Type OrderType { get; set; } = typeof(NodeOrder);
        public Type ShopArticleType { get; set; } = typeof(ShopArticle);
        public Type ShopArticleWithPropertiesType { get; set; } = typeof(ShopArticle);
        public Type OrderArticleType { get; set; } = typeof(OrderArticle);

        public Type OrderService { get; set; } = typeof(NodeOrderService);
        public Type ArticleService { get; set; } = typeof(MockArticleService);
        public Type ProductService { get; set; } = typeof(MockProductService);

    }
}
