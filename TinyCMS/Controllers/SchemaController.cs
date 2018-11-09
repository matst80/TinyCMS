using Microsoft.AspNetCore.Mvc;
using TinyCMS.Data.Builder;

namespace TinyCMS.Controllers
{
    [Route("schema")]
    [Produces("application/json")]
    public class SchemaController : Controller
    {

        readonly NodeTypeFactory _factory;
        readonly NodeSerializer _serializer;


        public SchemaController(NodeTypeFactory factory, NodeSerializer ser)
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
    }
}
