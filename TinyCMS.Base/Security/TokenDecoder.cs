using System;
using System.IdentityModel.Tokens.Jwt;
using TinyCMS.Security;
using Microsoft.IdentityModel.Tokens;
using System.Linq;

namespace TinyCMS.Base.Security
{
    public class TokenDecoder : ITokenDecoder
    {
        private readonly IJWTSettings jwtSettings;
        private readonly TokenValidationParameters validationParameters;

        public TokenDecoder(IJWTSettings jwtSettings)
        {
            this.jwtSettings = jwtSettings;
            this.validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = jwtSettings.GetSecurityKey(),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        }

        public string[] ValidateAndDecode(string token)
        {
            if (string.IsNullOrEmpty(token) || token == "undefined")
            {
                return null;
            }
            try
            {
                var claimsPrincipal = new JwtSecurityTokenHandler()
                    .ValidateToken(token, validationParameters, out var rawValidatedToken);

                var data = (JwtSecurityToken)rawValidatedToken;
                return data.Claims.Select(d => d.Value).ToArray();
                // Or, you can return the ClaimsPrincipal
                // (which has the JWT properties automatically mapped to .NET claims)
            }
            catch (SecurityTokenValidationException stvex)
            {
                return null;
            }
            catch (ArgumentException argex)
            {
                // The token was not well-formed or was invalid for some other reason.
                // TODO: Log it or display an error.
                throw new Exception($"Token was invalid: {argex.Message}");
            }
        }
    }
}
