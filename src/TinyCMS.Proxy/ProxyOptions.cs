using System.Net;
using System.Collections.Generic;
namespace TinyCMS.Proxy
{
    public class ProxyOptions
    {
        public string LocalUrl { get; set; }
        public string Destination { get; set; }
        public string Scheme { get; set; } = "https";
        public Dictionary<string,string> HeadersToAppend { get; set; }
    }
}
