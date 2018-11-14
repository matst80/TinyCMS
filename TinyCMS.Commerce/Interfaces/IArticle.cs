namespace TinyCMS.Commerce.Models
{
    public interface IArticle
    {
        string Name { get; set; }
        string ArticleNr { get; set; }
        float Price { get; set; }
        float Tax { get; set; }
    }
}
