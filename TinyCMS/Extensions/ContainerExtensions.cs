using TinyCMS.Data;
using TinyCMS.Data.Builder;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch.Helpers;
using TinyCMS.Interfaces;

namespace TinyCMS.SocketServer
{

    public static class ContainerExtensions
    {

        public static INode MatchRequest(this IContainer cnt, INodeRequest request, INodeTypeFactory typeFactory)
        {
            INode ret = null;
            switch (request.RequestType)
            {
                case RequestTypeEnum.Get:
                    return cnt.GetById(request.Data);
                case RequestTypeEnum.Add:
                    return request.GetNewNode(cnt, typeFactory);
                case RequestTypeEnum.Update:
                    return request.GetUpdatedNode(cnt);
                case RequestTypeEnum.Remove:
                    return request.RemoveNode(cnt);
                case RequestTypeEnum.Link:
                    var rel = request.GetRelation(cnt);
                    if (rel != null)
                    {
                        cnt.AddRelation(rel.From, rel.To);
                        ret = rel.From;
                    }
                    break;
            }
            return ret;
        }
    }
}
