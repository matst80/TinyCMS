namespace TinyCMS
{
    public interface ISerializerSettings
    {
        int Depth { get; }
        int Level { get; }
        bool IncludeRelations { get; }
    }
}
