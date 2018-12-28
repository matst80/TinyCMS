using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TinyCMS.Security
{
    public class JWTSettings : IJWTSettings
    {
        public JWTSettings(string key)
        {
            Key = Encoding.UTF8.GetBytes(key);
        }

        public byte[] Key { get; internal set; }

        public SecurityKey GetSecurityKey()
        {
            return new SymmetricSecurityKey(Key);
        }
    }
}