using System;
using TinyCMS.Data;
using System.Linq;
namespace CoNodes
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;
    using TinyCMS.Commerce.Models;

    public partial class CoProducts
    {
        [JsonProperty("Products")]
        public List<Product> Products { get; set; }

        [JsonProperty("Aggregations")]
        public Aggregations Aggregations { get; set; }

        [JsonProperty("TotalHits")]
        public long TotalHits { get; set; }

        [JsonProperty("ElapsedMilliseconds")]
        public long ElapsedMilliseconds { get; set; }

        [JsonProperty("MinPrice")]
        public double MinPrice { get; set; }

        [JsonProperty("MaxPrice")]
        public long MaxPrice { get; set; }
    }

    public partial class Aggregations
    {
        [JsonProperty("categoryIds")]
        public List<Brand> CategoryIds { get; set; }

        [JsonProperty("brand")]
        public List<Brand> Brand { get; set; }
    }

    public partial class Brand
    {
        [JsonProperty("Key")]
        public string Key { get; set; }

        [JsonProperty("DocCount")]
        public long DocCount { get; set; }
    }

    public partial class Product
    {
        [JsonProperty("Id")]
        public string Id { get; set; }

        [JsonProperty("ArticleId")]
        public long ArticleId { get; set; }

        [JsonProperty("Article")]
        public string Article { get; set; }

        [JsonProperty("Barcodes")]
        public List<string> Barcodes { get; set; }

        [JsonProperty("LanguageId")]
        public string LanguageId { get; set; }

        [JsonProperty("CountryId")]
        public string CountryId { get; set; }

        [JsonProperty("HeaderText")]
        public string HeaderText { get; set; }

        [JsonProperty("BodyText")]
        public string BodyText { get; set; }

        [JsonProperty("FbiText")]
        public string FbiText { get; set; }

        [JsonProperty("SaleChannelIds")]
        public object SaleChannelIds { get; set; }

        [JsonProperty("Images")]
        public List<string> Images { get; set; }

        [JsonProperty("ImagesBaseUrl")]
        public string ImagesBaseUrl { get; set; }

        [JsonProperty("CategoryIds")]
        public List<long> CategoryIds { get; set; }

        [JsonProperty("AllCategoryIds")]
        public List<long> AllCategoryIds { get; set; }

        [JsonProperty("EnergyClass")]
        public object EnergyClass { get; set; }

        [JsonProperty("UnitPrice")]
        public UnitPrice UnitPrice { get; set; }

        [JsonProperty("Prices")]
        public List<Price> Prices { get; set; }

        [JsonProperty("Attributes")]
        public List<Attribute> Attributes { get; set; }

        [JsonProperty("Rating")]
        public Rating Rating { get; set; }

        [JsonProperty("Shelves")]
        public List<object> Shelves { get; set; }

        [JsonProperty("IsSparepart")]
        public bool IsSparepart { get; set; }

        [JsonProperty("Status")]
        public long Status { get; set; }

        [JsonProperty("HasSpareparts")]
        public bool HasSpareparts { get; set; }

        [JsonProperty("HasAccessories")]
        public bool HasAccessories { get; set; }

        [JsonProperty("HasConsumableSupply")]
        public bool HasConsumableSupply { get; set; }

        [JsonProperty("StockBalance")]
        public long StockBalance { get; set; }

        [JsonProperty("BaseArticleId")]
        public long BaseArticleId { get; set; }

        [JsonProperty("IsBaseProduct")]
        public bool IsBaseProduct { get; set; }

        [JsonProperty("Variants")]
        public List<long> Variants { get; set; }

        [JsonProperty("VariantAttributes")]
        public List<VariantAttribute> VariantAttributes { get; set; }

        [JsonProperty("Brand")]
        public string Brand { get; set; }

        [JsonProperty("Manuals")]
        public List<Manual> Manuals { get; set; }

        [JsonProperty("Safetysheets")]
        public object Safetysheets { get; set; }

        [JsonProperty("IsNew")]
        public bool IsNew { get; set; }
    }

    public partial class Attribute
    {
        [JsonProperty("Ordinal")]
        public long Ordinal { get; set; }

        [JsonProperty("IsMultiValued")]
        public bool IsMultiValued { get; set; }

        [JsonProperty("MultiValuePosition")]
        public long MultiValuePosition { get; set; }

        [JsonProperty("ValuePosition")]
        public long ValuePosition { get; set; }

        [JsonProperty("ValueType")]
        public long ValueType { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Value")]
        public string Value { get; set; }

        [JsonProperty("Unit")]
        public string Unit { get; set; }

        [JsonProperty("DecimalValue")]
        public double DecimalValue { get; set; }

        [JsonProperty("IsBooleanValue")]
        public bool IsBooleanValue { get; set; }
    }

    public partial class Manual
    {
        [JsonProperty("Url")]
        public Uri Url { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("Ordinal")]
        public long Ordinal { get; set; }
    }

    public partial class Price
    {
        [JsonProperty("PriceQuantity")]
        public long PriceQuantity { get; set; }

        [JsonProperty("IsOrdinaryPriceListType")]
        public bool IsOrdinaryPriceListType { get; set; }

        [JsonProperty("Price")]
        public float PricePrice { get; set; }

        [JsonProperty("PricelistTypeId")]
        public long PricelistTypeId { get; set; }
    }

    public partial class Rating
    {
        [JsonProperty("AverageRating")]
        public double AverageRating { get; set; }

        [JsonProperty("AverageRatingPercentage")]
        public long AverageRatingPercentage { get; set; }

        [JsonProperty("ReviewCount")]
        public long ReviewCount { get; set; }

        [JsonProperty("QuestionCount")]
        public long QuestionCount { get; set; }
    }

    public partial class UnitPrice
    {
        [JsonProperty("Factor")]
        public long Factor { get; set; }

        [JsonProperty("Unit")]
        public string Unit { get; set; }
    }

    public partial class VariantAttribute
    {
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Value")]
        public string Value { get; set; }

        [JsonProperty("Unit")]
        public string Unit { get; set; }

        [JsonProperty("Ordinal")]
        public long Ordinal { get; set; }
    }

    public class ProductAttribute : ArticleProperty
    {
        //public string Unit { get; set; }
    }

    public class ProductData : BaseNode, IShopArticleWithProperties
    {

        public ProductData()
        {
        }

        public ProductData(Product prod)
        {
            Id = Guid.NewGuid().ToString();
            ArticleNr = prod.Article;
            Name = prod.HeaderText;
            Tax = 25;
            Price = 1;
            Description = prod.BodyText;
            ImagesBaseUrl = prod.ImagesBaseUrl;
            Images = prod.Images;
            var price = prod.Prices.FirstOrDefault();
            if (price != null)
            {
                Price = price.PricePrice;
            }
            Properties = new ObservableCollection<ProductAttribute>();
            foreach (var attr in prod.Attributes)
            {
                Properties.Add(new ProductAttribute()
                {
                    Key = attr.Name,
                    Value = attr.Value,
                    Unit = attr.Unit
                });
            }
        }

        public override string Type => "coproduct";
        public override string Id { get => ArticleNr; set => base.Id = value; }

        private ObservableCollection<ProductAttribute> _properties;
        public ObservableCollection<ProductAttribute> Properties
        {
            get
            {
                return _properties;
            }
            set { _properties = value; }
        }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImagesBaseUrl { get; set; }
        public string ArticleNr { get; set; }
        public float Price { get; set; }
        public float Tax { get; set; }

        [JsonIgnore]
        ObservableCollection<IProperty> IShopArticleWithProperties.Properties
        {
            get
            {
                return new ObservableCollection<IProperty>(_properties.OfType<IProperty>());
            }
            set
            {

            }
        }

        public List<string> Images { get; set; }
    }
}
