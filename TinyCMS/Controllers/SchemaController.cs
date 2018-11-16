using System;
using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data.Builder;
using TinyCMS.Interfaces;

namespace TinyCMS.Controllers
{
    [Route("/api/schema")]
    [Produces("application/json")]
    public class SchemaController : Controller
    {

        readonly INodeTypeFactory _factory;
        readonly INodeSerializer _serializer;

        private void SendOkJson()
        {
            Response.ContentType = "application/json";
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public SchemaController(INodeTypeFactory factory, INodeSerializer ser)
        {
            this._factory = factory;
            this._serializer = ser;
        }

        [HttpGet("{type}")]
        public void GetSchema(string type)
        {
            SendOkJson();
            _serializer.StreamSchema(_factory.GetTypeByName(type), Response.Body);
        }

        [HttpGet]
        public void GetAll()
        {
            SendOkJson();
            _serializer.WriteValue(Response.Body, _factory.RegisterdTypeNames());
        }
    }
}
