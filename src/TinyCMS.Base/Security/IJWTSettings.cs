using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace TinyCMS.Security
{
    public interface IJWTSettings
    {
        byte[] Key { get; }
        SecurityKey GetSecurityKey();
    }
}