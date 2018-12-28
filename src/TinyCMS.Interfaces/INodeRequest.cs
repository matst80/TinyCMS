using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace TinyCMS.Interfaces
{
    public interface INodeRequest
    {
        RequestTypeEnum RequestType { get; }
        string Data { get; }
        JObject JsonData { get; }
        Dictionary<string, string> QueryString { get; }
    }
}
