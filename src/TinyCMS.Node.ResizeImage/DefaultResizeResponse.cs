using System;
namespace TinyCMS.Node.ResizeImage
{
    [Serializable]
    public class DefaultResizeResponse : IResizeResponse
    {
        public string Token { get; set; }
        public string Url { get; set; }
        public string CustomData { get; set; }
    }
}
