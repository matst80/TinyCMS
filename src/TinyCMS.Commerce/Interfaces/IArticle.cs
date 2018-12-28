using System.ComponentModel;

namespace TinyCMS.Commerce.Models
{
    public interface IArticle : INotifyPropertyChanged
    {
        string Name { get; set; }
        string ArticleNr { get; set; }
        float Price { get; set; }
        float Tax { get; set; }
    }
}
