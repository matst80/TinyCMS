using System;
using System.Security.Cryptography.X509Certificates;

namespace TinyCMS.Security
{
    public interface IAuthenticationData
    {
        string Token { get; }
        string Email { get; }
        bool Authenticated { get; }
        string[] Roles { get; }
    }
}