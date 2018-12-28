using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data.Extensions;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
using TinyCMS.Commerce;
using TinyCMS.Commerce.Services;
using TinyCMS.Commerce.Models;

namespace TinyCMS.Controllers
{
    [Route("/api/shop/cart")]
    [Produces("application/json")]
    public class ShopController : Controller
    {
        private readonly IShopFactory factory;
        private readonly IOrderService orderService;

        public ShopController(IShopFactory factory)
        {
            this.factory = factory;
            this.orderService = factory.OrderService;
        }


        [HttpGet]
        public JsonResult Get()
        {
            return Json(orderService.GetNewOrder());
        }


        [HttpGet("{id}")]
        public JsonResult Get(string id)
        {
            return Json(orderService.GetOrder(id));
        }


        [HttpPut("{id}")]
        public JsonResult Put(string id, [FromBody]Dictionary<string,object> articleData)
        {
            var order = orderService.GetOrder(id);
            var articleNr = articleData["articleNr"] as string;
            var orgArticle = factory.ArticleService.GetByArticleNr(articleNr);
            if (orgArticle==null)
            {
                orgArticle = factory.CreateInstance<IArticle>();
            }
            orgArticle.Apply(articleData);
            order.AddArticle(orgArticle, 1);
            return Json(order);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
