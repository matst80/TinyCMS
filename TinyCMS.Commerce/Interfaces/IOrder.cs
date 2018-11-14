using System;
namespace TinyCMS.Commerce.Models
{
    public interface IOrder
    {
        string FirstName { get; set; }
        string LastName { get; set; }
        string Id { get; }
        DateTime Created { get; set; }
        bool IsLocked { get; }
        OrderStatusEnum Status { get; set; }
        PaymentStatusEnum PaymentStatus { get; set; }
    }
}
