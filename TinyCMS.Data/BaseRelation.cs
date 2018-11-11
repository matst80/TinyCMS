using System;
using System.Collections.Generic;
using TinyCMS.Interfaces;

namespace TinyCMS.Data
{
    [Serializable]
    public class BaseRelation : IRelation, IEqualityComparer<IRelation>
    {
        public BaseRelation(INode from, INode to)
        {
            From = from;
            To = to;
        }

        public INode From { get; set; }
        public INode To { get; set; }

        public bool Equals(IRelation x, IRelation y)
        {
            return (x.From == y.From && x.To == y.To) ||
                (x.From == y.To && x.To == y.From);
        }

        public int GetHashCode(IRelation obj)
        {
            return base.GetHashCode();
        }
    }
}
