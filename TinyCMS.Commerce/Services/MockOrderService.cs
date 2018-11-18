using System;
using TinyCMS.Commerce.Models;

namespace TinyCMS.Commerce.Services
{
    public class MockOrderService : OrderServiceBase
    {
        internal override void DeleteOrder(IOrder order)
        {

        }

        public override IOrder GetOrder(string id)
        {
            var ret= base.GetOrder(id);
            if (ret == null)
                ret = GetNewOrder();
            return ret;
        }

        internal override void SaveOrder(IOrder order)
        {

        }
    }
}
