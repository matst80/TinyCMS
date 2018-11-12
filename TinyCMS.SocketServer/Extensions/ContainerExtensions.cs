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
                    if (rel.Item1!=null && rel.Item2!=null)
                    {
                        cnt.AddRelation(rel.Item1, rel.Item2);
                        ret = rel.Item1;
                    }
                    break;
            }
            return ret;
        }
    }
}
