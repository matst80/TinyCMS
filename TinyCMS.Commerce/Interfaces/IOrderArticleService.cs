using TinyCMS.Commerce.Models;
using System.Collections.Generic;
namespace TinyCMS.Commerce.Services
{
    public interface IOrderArticleService<T, O> where T : IOrderArticle where O : IOrder
    {
        T AddToOrder(IArticle article, O order);
        void RemoveFromOrder(T article, O order);
        IEnumerable<T> GetArticlesInOrder(O order);
    }

}
