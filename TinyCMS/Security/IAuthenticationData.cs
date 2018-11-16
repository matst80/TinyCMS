using System;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TinyCMS.Security
{
    public interface IAuthenticationData
    {
        string Token { get; }
        string Email { get; }
        bool Authenticated { get; }
        string[] Roles { get; }
    }

    public interface IJWTSettings
    {
        byte[] Key { get; }
        SecurityKey GetSecurityKey();
    }

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