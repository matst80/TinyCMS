using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data.Builder;
using TinyCMS.Interfaces;

namespace TinyCMS.Controllers
{
    [Route("schema")]
    [Produces("application/json")]
    public class SchemaController : Controller
    {

        readonly INodeTypeFactory _factory;
        readonly INodeSerializer _serializer;


        public SchemaController(INodeTypeFactory factory, INodeSerializer ser)
        {
            this._factory = factory;
            this._serializer = ser;
        }

        [HttpGet("{type}")]
        public void GetSchema(string type)
        {
            var temporaryObject = _factory.GetNew(type);
            Response.ContentType = "application/json";
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            _serializer.StreamSchema(_factory.GetTypeByName(type), Response.Body);
        }

        [HttpGet]
        public void GetAll()
        {
            var allTypes = _factory.RegisterdTypeNames();
            Response.ContentType = "application/json";
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            _serializer.WriteValue(Response.Body, allTypes);
        }
    }
}
