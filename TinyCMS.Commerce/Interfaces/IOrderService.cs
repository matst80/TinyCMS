using TinyCMS.Commerce.Models;

namespace TinyCMS.Commerce.Services
{
    public interface IOrderService
    {
        IOrder GetNewOrder();
        IOrder GetOrder(string id);
        void Delete(IOrder order);
    }

}
