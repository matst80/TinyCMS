using System.Threading.Tasks;

namespace TinyCMS.Security
{
    public interface ITokenValidator
    {
        Task<IAuthenticationData> ValidateTokenAsync(string token);
    }
}
