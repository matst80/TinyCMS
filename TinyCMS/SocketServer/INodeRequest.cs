using System.Collections.Generic;

namespace TinyCMS
{
    public interface INodeRequest
    {
        RequestTypeEnum RequestType { get; }
        string Data { get; }
        Dictionary<string, string> QueryString { get; }
    }
}
