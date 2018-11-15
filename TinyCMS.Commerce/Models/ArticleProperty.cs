using System.ComponentModel;

namespace TinyCMS.Commerce.Models
{
    public class ArticleProperty : IProperty
    {
        public string Value { get; set; }
        public string Key { get; set; }
        public event PropertyChangedEventHandler PropertyChanged;
    }
}
