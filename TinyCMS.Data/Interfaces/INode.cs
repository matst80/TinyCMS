using System;
using System.Collections.Generic;

namespace TinyCMS.Data
{
    public interface INode
    {
        string Id { get; set; }
        string ParentId { get; set; }
        string Type { get; }
        IList<string> Tags { get; set; }
        IList<INode> Children { get; set; }
    }
}
