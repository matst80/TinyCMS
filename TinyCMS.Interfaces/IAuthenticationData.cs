using System;

namespace TinyCMS.Security
{
    public interface IAuthenticationData
    {
        string Token { get; }
        string Email { get; }
        bool Authenticated { get; }
        string[] Roles { get; }
    }

    public class RequireRoleAttribute : Attribute
    {
        public string RequiredRole { get; set; }
    }
}