using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using TinyCMS.Data.Extensions;
using TinyCMS.Data.Nodes;

namespace TinyCMS.Controllers
{
    [Route("api")]
    public class SiteController : Controller
    {
        readonly Container _container;

        readonly NodeTypeFactory _factory;

        public SiteController(Container cnt, NodeTypeFactory factory)
        {
            this._factory = factory;
            this._container = cnt;
        }
        // GET api/values
        [HttpGet]
        public INode Get()
        {
            return _container.RootNode;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public INode Get(string id)
        {
            return _container.GetById(id);
        }

        // POST api/values
        [HttpPost("{parentId}")]
        public INode AddNew(string parentId, string type, [FromBody]IDictionary<string,object> data)
        {
            var parent = _container.GetById(parentId);
            var newnode = _factory.GetNew(type);
            if (parent != null && newnode != null)
            {
                parent.Add(newnode, data);
                return newnode;
            }
            return null;
        }

        //// PUT api/values/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/values/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
