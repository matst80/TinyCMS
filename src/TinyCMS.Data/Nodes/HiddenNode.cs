using System;
using TinyCMS.Security;

namespace TinyCMS.Data.Nodes
{
    [Serializable, RequireRole(RequiredRole = "admin")]
    public class HiddenNode : BaseNode
    {
        public override string Type => "hidden";
    }
}
