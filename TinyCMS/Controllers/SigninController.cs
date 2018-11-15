using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TinyCMS.Security;

namespace TinyCMS.Controllers
{
    [Route("signInWithToken")]
    [Produces("application/json")]
    [Consumes("application/json")]
    public class SigninController : Controller
    {

        public SigninController(ITokenValidator authenticator)
        {
            this.authenticator = authenticator;
        }

        private readonly ITokenValidator authenticator;

        [HttpPost]
        public async Task<JsonResult> ValidateToken([FromBody] TokenValidationRequest request)
        {
            return Json(await authenticator.ValidateTokenAsync(request.token));
        }
    }

    public class TokenValidationRequest
    {
        public string token { get; set; }
    }
}
