using System;
using TinyCMS.Commerce.Models;
using System.Collections.Generic;
using System.Linq;

namespace TinyCMS.Commerce.Services
{

    public class ArticleService : IArticleService
    {
        public List<IArticle> allArticles = new List<IArticle>();

        public void Add(IArticle article)
        {
            if (!allArticles.Contains(article))
            {
                allArticles.Add(article);
            }
        }

        public IList<IArticle> GetAll()
        {
            return allArticles;
        }

        public IArticle GetByArticleNr(string articleNr)
        {
            return allArticles.FirstOrDefault(d => articleNr.Equals(d.ArticleNr));
        }

        public void Remove(IArticle article)
        {
            allArticles.Remove(article);
        }
    }

}
