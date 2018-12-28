using System.Linq;
using TinyCMS.Commerce.Models;
using TinyCMS.Commerce.Nodes;
using TinyCMS.Data.Extensions;
using TinyCMS.Data.Nodes;
using TinyCMS.Interfaces;

namespace TinyCMS.Commerce.Services
{
    public class NodeOrderService : OrderServiceBase
    {
        private readonly IContainer container;
        private readonly INode orderRoot;

        private const string OrderRootId = "order-root";

        public NodeOrderService(IContainer container) 
        {
            this.container = container;
            orderRoot = container.GetById(OrderRootId);
            if (orderRoot == null)
            {
                container.RootNode.Add(new HiddenNode()
                {
                    Id = OrderRootId
                });
            }
            else
            {
                foreach (var order in orderRoot.Children.OfType<NodeOrder>())
                {
                    ActiveOrders.Add(order);
                }
            }
        }
        internal override void DeleteOrder(IOrder order)
        {
            if (order is NodeOrder nodeOrder) {
                container.RemoveNode(nodeOrder);
            }
        }

        public override IOrder GetNewOrder() {
            var order = base.GetNewOrder() as NodeOrder;
            orderRoot.Add(order);
            return order;
        }

        public override IOrder GetOrder(string id)
        {
            var order = base.GetOrder(id);
            if (order==null)
            {
                order = base.GetNewOrder();
                if (order is NodeOrder nodeOrder)
                {
                    nodeOrder.Id = id;
                    orderRoot.Add(nodeOrder);
                }
            }
            return order;
        }

        internal override void SaveOrder(IOrder order)
        {
            // node changes handles this
        }
    }
}
