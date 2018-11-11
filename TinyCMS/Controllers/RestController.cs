using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using TinyCMS.Data.Extensions;
using TinyCMS.Interfaces;

namespace TinyCMS.Controllers
{

    [Route("api")]
    [Produces("application/json")]
    public class RestController : Controller
    {
        readonly IContainer _container;
        readonly INodeTypeFactory _factory;
        readonly INodeSerializer _serializer;

        private void OK(INode node, int depth = 0)
        {
            Response.ContentType = "application/json";
            _serializer.StreamSerialize(node, Response.Body, depth);
        }

        public RestController(IContainer cnt, INodeTypeFactory factory, INodeSerializer ser)
        {
            this._factory = factory;
            this._container = cnt;
            this._serializer = ser;
        }

        [HttpGet]
        public void Get(int depth = 3)
        {
            OK(_container.RootNode, depth);
            //_serializer.StreamSerialize(_container.RootNode, Response.Body, depth);
            //Response.Body.Write(_serializer.Serialize(_container.RootNode, depth));
        }

        [HttpPost]
        public void GetByIds([FromBody]string[] ids)
        {
            var nodes = ids.Select(_container.GetById).Where(x => x != null);
            Response.ContentType = "application/json";
            _serializer.WriteValue(Response.Body, nodes);
        }

        [HttpGet("{id}")]
        public void Get(string id, int depth = 3)
        {
            OK(_container.GetById(id), depth);
        }

        [HttpPost("{parentId}")]
        public void AddNew(string parentId, string type, [FromBody]IDictionary<string, object> data)
        {
            var parent = _container.GetById(parentId);
            var newnode = _factory.GetNew(type);
            if (parent != null && newnode != null)
            {
                parent.Add(newnode, data);
                OK(newnode, 0);
            }
        }

        [HttpPut("{id}")]
        public void Update(string id, [FromBody]IDictionary<string, object> values)
        {
            var node = _container.GetById(id);
            node.Apply(values);
            OK(node, 1);
        }

        [HttpPut("{fromId}/{toId}")]
        public bool AddRelation(string fromId, string toId)
        {
            _container.AddRelation(_container.GetById(fromId), _container.GetById(toId));
            return true;
        }

        [HttpDelete("{id}")]
        public bool Delete(string id)
        {
            var node = _container.GetById(id);
            if (node != null)
            {
                _container.RemoveNode(node);
                return true;
            }
            return false;
        }
    }
}
