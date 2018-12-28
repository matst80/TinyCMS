namespace TinyCMS.Commerce.Models
{
    public interface IOrderArticle : IArticle
    {
        string OrderId { get; set; }
        int Noi { get; set; }
    }
}
