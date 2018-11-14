namespace TinyCMS.Commerce.Models
{
    public class Article : IArticle
    {
        public string Name { get; set; }
        public string ArticleNr { get; set; }
        public float Price { get; set; }
        public float Tax { get; set; }
    }
}
