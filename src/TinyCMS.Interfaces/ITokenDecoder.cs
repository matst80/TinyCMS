
namespace TinyCMS.Base.Security
{
    public interface ITokenDecoder
    {
        string[] ValidateAndDecode(string token);
    }
}
