namespace TinyCMS.Commerce.Models
{
    public class OrderArticle : IOrderArticle
    {
        public string OrderId { get; set; }
        public string Name { get; set; }
        public string ArticleNr { get; set; }
        public float Price { get; set; }
        public float Tax { get; set; }
        public int Noi { get; set; } = 1;
    }
}
