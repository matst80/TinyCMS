using System;
using System.Threading.Tasks;
using System.Net.Http;

namespace TinyCMS.Data.Nodes
{
    [Serializable]
    public class Image : File
    {
        public override string Type => "image";
        public double Width { get; set; }
        public double Height { get; set; }
        public string Alt { get; set; }
    }


}
