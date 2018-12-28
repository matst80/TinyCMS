using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;

namespace TinyCMS.Commerce.Models
{
    public interface IOrder : INotifyPropertyChanged
    {
        string FirstName { get; set; }
        string LastName { get; set; }
        string Id { get; }
        DateTime Created { get; set; }
        bool IsLocked { get; }
        OrderStatusEnum Status { get; set; }
        PaymentStatusEnum PaymentStatus { get; set; }
        IList<IOrderArticle> Articles { get; }
        IOrderArticle AddArticle(IArticle article, int noi);
        void RemoveArticle(IOrderArticle article);
    }
}
