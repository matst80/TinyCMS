using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

using Microsoft.IdentityModel.Tokens;

namespace TinyCMS.Security
{
    public class FirebaseAuthentication : ITokenValidator
    {
        public async Task<IAuthenticationData> ValidateTokenAsync(string idToken)
        {
            return null;
        }
    }
}
