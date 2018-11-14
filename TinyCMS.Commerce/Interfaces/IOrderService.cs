using TinyCMS.Commerce.Models;
namespace TinyCMS.Commerce.Services
{
    public interface IOrderService<T> where T : IOrder
    {
        T CreateNewOrder();
        T GetOrder(string id);
        void DeleteOrder(T order);
    }

}
