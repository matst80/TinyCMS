using System.ComponentModel;

namespace TinyCMS.Commerce.Models
{
    public interface IProperty : INotifyPropertyChanged
    {
        string Value { get; set; }
        string Key { get; set; }
    }
}
