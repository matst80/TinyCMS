using System;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using System.Linq;

namespace TinyCMS.SocketServer
{
    public static class ContainerExtensions
    {
        public static INode MatchRequest(this Container cnt, INodeRequest request)
        {
            INode ret = null;
            switch (request.RequestType)
            {
                case RequestTypeEnum.Get:
                    ret = cnt.GetById(request.Data);
                    break;
            }
            return ret;
        }
    }
}
