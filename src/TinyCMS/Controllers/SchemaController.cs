using System;
using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data.Builder;
using TinyCMS.Interfaces;
using System.Linq;

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

        private string GetToken()
        {
            if (Request.Headers.TryGetValue("Authorization",out var authHeader))
            {
                return authHeader;
            }
            return string.Empty;
        }

        [HttpGet("{type}")]
        public void GetSchema(string type)
        {
            SendOkJson();
            _serializer.StreamSchema(_factory.GetTypeByName(type), GetToken(), Response.Body);
        }

        [HttpGet]
        public void GetAll()
        {
            SendOkJson();
            _serializer.WriteValue(Response.Body, GetToken(), _factory.RegisterdTypeNames());
        }
    }
}
