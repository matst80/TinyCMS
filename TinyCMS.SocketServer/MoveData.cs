using System;
using System.Collections.Generic;
namespace TinyCMS.SocketServer
{
    [Serializable]
    public class MoveData
    {
        public string ParentId { get; set; }
        public string OldParentId { get; set; }
        public string Id { get; set; }
        public int NewIndex { get; set; }
    }
}
