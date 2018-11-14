using System;
using TinyCMS.Commerce.Models;
using System.Collections.Generic;
using System.Linq;

namespace TinyCMS.Commerce.Services
{
    public class OrderArticleService<T, O> : IOrderArticleService<T, O> where T : IOrderArticle where O : IOrder
    {
        private List<T> orderArticles = new List<T>();

        public T AddToOrder(IArticle article, O order)
        {
            var orderArticle = Activator.CreateInstance<T>();
            orderArticle.Noi = 1;
            orderArticle.OrderId = order.Id;
            orderArticles.Add(orderArticle);
            return orderArticle;
        }

        public IEnumerable<T> GetArticlesInOrder(O order)
        {
            return orderArticles.Where(d => d.OrderId == order.Id);
        }

        public void RemoveFromOrder(T article, O order)
        {
            article.OrderId = string.Empty;
            orderArticles.Remove(article);
        }
    }

}
