using TinyCMS.Interfaces;

namespace TinyCMS.Interfaces
{
    public interface IRelation
    {
        string FromId { get; }
        string ToId { get; }
    }
}
