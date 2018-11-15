using System.Collections.Generic;
using TinyCMS.Commerce.Models;
namespace TinyCMS.Commerce.Services
{
    public interface IArticleService
    {
        IList<IArticle> GetAll();
        void Add(IArticle article);
        void Remove(IArticle article);
        IArticle GetByArticleNr(string articleNr);
    }
}
