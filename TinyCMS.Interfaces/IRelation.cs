using TinyCMS.Interfaces;

namespace TinyCMS.Interfaces
{
    public interface IRelation
    {
        INode From { get; set; }
        INode To { get; set; }
    }
}
