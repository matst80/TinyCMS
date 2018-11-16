using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
namespace TinyCMS.Commerce.Models
{
    public class Order : IOrder
    {
        public Order()
        {
            Articles = new List<IOrderArticle>();
            Created = DateTime.Now;
            Id = Guid.NewGuid().ToString();
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Id { get; set; }
        public DateTime Created { get; set; }

        public bool IsLocked { get; set; }

        public OrderStatusEnum Status { get; set; }
        public PaymentStatusEnum PaymentStatus { get; set; }

        public IList<IOrderArticle> Articles { get; internal set; }

        public event PropertyChangedEventHandler PropertyChanged;

        public IOrderArticle AddArticle(IArticle article, int noi)
        {
            var orderArticle = Factory.Instance.CreateInstance<IOrderArticle>();
            orderArticle.Noi = Math.Max(1,noi);
            // Replace with generic copy method
            orderArticle.ArticleNr = article.ArticleNr;
            orderArticle.Name = article.Name;
            Articles.Add(orderArticle);
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Articles)));
            return orderArticle;
        }

        public void RemoveArticle(IOrderArticle article)
        {
            if (Articles.Contains(article))
                Articles.Remove(article);
        }
    }
}
