using System;
using TinyCMS.Commerce.Models;
using System.Collections.Generic;
using System.Linq;
namespace TinyCMS.Commerce.Services
{
    public class OrderService<T> : IOrderService<T> where T : IOrder
    {
        public Dictionary<string, T> activeOrders = new Dictionary<string, T>();

        public T CreateNewOrder()
        {
            return GenerateNewOrder();
        }

        public void DeleteOrder(T order)
        {
            DeleteOrderFromStorage(order);
        }

        internal virtual void DeleteOrderFromStorage(IOrder order)
        {
            if (activeOrders.ContainsKey(order.Id))
                activeOrders.Remove(order.Id);
        }

        public T GetOrder(string id)
        {
            return GetOrderFromStorage(id);
        }

        private T GetOrderFromStorage(string id)
        {
            if (activeOrders.ContainsKey(id))
                return activeOrders[id];
            return default(T);
        }

        private T GenerateNewOrder()
        {
            var ret = Activator.CreateInstance<T>();
            activeOrders.Add(ret.Id, ret);
            return ret;
        }

    }

}
