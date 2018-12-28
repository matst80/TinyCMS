using System;
using System.Net.Http;
using System.Dynamic;
namespace TinyCMS.Proxy
{
    public class ProxyService
    {
        public ProxyService()
        {
            Client = new HttpClient();
        }

        internal HttpClient Client { get; private set; }
    }
}
