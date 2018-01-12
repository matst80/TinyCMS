namespace TinyCMS.Data
{
    public interface IRelation
    {
        INode From { get; set; }
        INode To { get; set; }
    }
}
