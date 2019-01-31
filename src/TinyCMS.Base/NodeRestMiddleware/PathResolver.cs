using System;
using Microsoft.AspNetCore.Http;
using TinyCMS.Interfaces;

namespace TinyCMS.Base
{
    public class PathResolver
    {
        private readonly string baseUrl;
        private readonly bool requireType;
        private readonly bool returnTrueOnBaseUrl;
        private readonly INodeTypeFactory factory;

        public PathResolver(INodeTypeFactory factory, string baseUrl = "nodeapi", bool requireType = false, bool returnTrueOnBaseUrl = false)
        {
            this.baseUrl = baseUrl;
            this.requireType = requireType;
            this.returnTrueOnBaseUrl = returnTrueOnBaseUrl;
            this.factory = factory;
        }

        public PathResult Parse(PathString path)
        {
            var parts = path.ToString().TrimStart('/').Split("/");

            if (parts.Length > 0)
            {
                if (parts[0].Equals(baseUrl))
                {
                    if (parts.Length > 1)
                    {
                        var typeNameOrId = parts[1];
                        var foundType = factory.GetTypeByName(typeNameOrId);
                        if (foundType != null)
                        {
                            string id = (parts.Length > 2) ? parts[2] : null;
                            return new PathResult(true, foundType, id);
                        }
                        if (!requireType)
                        {
                            return new PathResult(true, null, typeNameOrId);
                        }

                    }
                    if (returnTrueOnBaseUrl)
                    {
                        return new PathResult(true, null, null);
                    }
                }
            }
            return new PathResult(false, null, null);
        }
    }
}
