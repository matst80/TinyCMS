using System;
using System.Threading.Tasks;
using System.Net.Http;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Image : BaseNode
    {
        public override string Type => "image";
        public double Width { get; set; }
        public double Height { get; set; }
        public string Alt { get; set; }

        [EditorType("url")]
        public string Url { get; set; } = "https://humorside.com/wp-content/uploads/2017/12/thank-you-meme-05.jpg";

        public string Path { get; set; }
    }


}
