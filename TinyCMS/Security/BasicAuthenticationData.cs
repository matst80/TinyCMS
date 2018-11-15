using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

namespace TinyCMS.Security
{
    public class BasicAuthenticationData : IAuthenticationData
    {
        public string Token { get; internal set; }

        public BasicAuthenticationData(SecurityKey key, string email, bool authenticated, params string[] roles)
        {
            Email = email;
            Authenticated = authenticated;
            Roles = roles;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Role, string.Join(',',roles)),
                    new Claim(ClaimTypes.Email, email)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            Token = tokenHandler.WriteToken(token);
        }

        public string Name { get; internal set; }

        public string Email { get; internal set; }

        public bool Authenticated { get; internal set; }

        public string[] Roles { get; internal set; }
    }
}
