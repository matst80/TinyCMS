using System;

namespace TinyCMS.Base
{
    public class PathResult
    {
        public PathResult(bool isHandled, Type nodeType, string id)
        {
            IsHandled = isHandled;
            NodeType = nodeType;
            Id = id;
        }

        public void SetId(string id)
        {
            Id = id;
        }

        public bool IsHandled { get; }
        public Type NodeType { get; }
        public string Id { get; internal set; }
    }
}
