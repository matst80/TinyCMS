using System;
using TinyCMS.Interfaces;
using GraphQL.Types;

namespace TinyCMS.GraphQL.Interfaces
{
    public interface IGraphQLPlugin : ITinyPlugin
    {
        void OnGraphInit(IObjectGraphType query, IObjectGraphType mutation);
    }
}
