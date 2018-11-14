using System;
using System.Dynamic;
namespace TinyCMS.Commerce.Models
{
    public class Order : IOrder
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Id { get; set; }
        public DateTime Created { get; set; }

        public bool IsLocked { get; set; }

        public OrderStatusEnum Status { get; set; }
        public PaymentStatusEnum PaymentStatus { get; set; }
    }
}
