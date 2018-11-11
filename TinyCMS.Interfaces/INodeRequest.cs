using System.Collections.Generic;

namespace TinyCMS.Interfaces
{
    public interface INodeRequest
    {
        RequestTypeEnum RequestType { get; }
        string Data { get; }
        Dictionary<string, object> JsonData { get; }
        Dictionary<string, string> QueryString { get; }
    }
}
