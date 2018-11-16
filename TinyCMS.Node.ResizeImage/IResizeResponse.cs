using System.Security.Cryptography.X509Certificates;
namespace TinyCMS.Node.ResizeImage
{
    public interface IResizeResponse
    {
        string Token { get; }
        string Url { get; }
        string CustomData { get; }
    }
}