using Microsoft.IdentityModel.Tokens;

namespace TinyCMS.Security
{
    public interface IJWTSettings
    {
        byte[] Key { get; }
        SecurityKey GetSecurityKey();
    }
}