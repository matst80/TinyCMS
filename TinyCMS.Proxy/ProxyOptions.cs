namespace TinyCMS.Proxy
{
    public class ProxyOptions
    {
        public string LocalUrl { get; set; }
        public string Destination { get; set; }
        public string Scheme { get; set; } = "https";
    }
}
