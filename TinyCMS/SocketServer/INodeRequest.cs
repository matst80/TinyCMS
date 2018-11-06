using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;

namespace TinyCMS
{
    public interface INodeRequest
    {
        RequestTypeEnum RequestType { get; }
        string Data { get; }
        Dictionary<string, object> JsonData { get; }
        Dictionary<string, string> QueryString { get; }
    }
}
