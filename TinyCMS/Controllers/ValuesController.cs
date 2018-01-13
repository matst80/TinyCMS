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

        [HttpGet("{id}")]
        public INode Get(string id)
        {
            return _container.GetById(id);
        }

        // POST api/values
        [HttpPost("{parentId}")]
        public INode AddNew(string parentId, string type, [FromBody]IDictionary<string, object> data)
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

        [HttpPut("{id}")]
        public INode Update(string id, [FromBody]IDictionary<string, object> values)
        {
            var node = _container.GetById(id);
            node.Apply(values);
            return node;
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            var node = _container.GetById(id);
            if (node != null)
                _container.RemoveNode(node);
        }
    }
}
