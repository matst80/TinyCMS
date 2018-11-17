using System;
using System.Collections.Generic;
using TinyCMS.Interfaces;

namespace TinyCMS.Data
{
    [Serializable]
    public class BaseRelation : IRelation, IEqualityComparer<IRelation>
    {
        public BaseRelation(string from, string to)
        {
            FromId = from;
            ToId = to;
        }
        public string FromId { get; private set; }
        public string ToId { get; private set; }

        public bool Equals(IRelation x, IRelation y)
        {
            return (x.FromId == y.FromId && x.ToId == y.ToId) ||
                (x.FromId == y.ToId && x.ToId == y.FromId);
        }

        public int GetHashCode(IRelation obj)
        {
            return base.GetHashCode();
        }
    }
}
