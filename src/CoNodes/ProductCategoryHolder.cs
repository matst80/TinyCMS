using System;
using TinyCMS.Data;
using System.Net.Http;
using System.Linq;
namespace CoNodes
{


    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class CoCategory
    {
        [JsonProperty("Id")]
        public string Id { get; set; }

        [JsonProperty("CategoryId")]
        public int CategoryId { get; set; }

        [JsonProperty("Level")]
        public int Level { get; set; }

        [JsonProperty("TopKey")]
        public long TopKey { get; set; }

        [JsonProperty("ParentId")]
        public int ParentId { get; set; }

        [JsonProperty("LanguageId")]
        public string LanguageId { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("FullPath")]
        public string FullPath { get; set; }

        public List<CoCategory> Categories { get; set; } = new List<CoCategory>();
    }


    public class ProductCategory : BaseNode
    {
        public ProductCategory(CoCategory baseCategory) : this()
        {
            Id = baseCategory.Id;
            Name = baseCategory.Name;
            CatId = baseCategory.CategoryId;
            OrgParentId = baseCategory.ParentId;
            foreach (var cat in baseCategory.Categories)
            {
                var old = Children.OfType<ProductCategory>().FirstOrDefault(d => d.CatId == cat.CategoryId);
                if (old == null)
                {
                    Children.Add(new ProductCategory(cat));
                }
                else
                {
                    old.Name = cat.Name;
                }
            }

        }

        public ProductCategory()
        {
            PropertyChanged += async (sender, e) =>
            {
                if (e.PropertyName == "SyncHash" && !string.IsNullOrEmpty(SyncHash))
                {
                    await SyncProducts();
                }
            };
        }

        public string SyncHash { get; set; }

        public async Task SyncProducts()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("X-ZUMO-APPLICATION", "MBzVPeguJZtQFDtrFohMjaHmwFQvYc30");
            var jsonString = await client.GetStringAsync(@"https://cit-api-search-exp-stream01-qa-api.azurewebsites.net/api/product?q=allCategoryIds:{" + CatId + "}&page=0&take=3000&languageid=s&countryid=se&useLite=false");
            var prods = JsonConvert.DeserializeObject<CoProducts>(jsonString);

            var foundProducts = Children.OfType<ProductData>().ToList();
            foreach (var prod in prods.Products)
            {
                var prodData = new ProductData(prod);
                var foundProduct = foundProducts.FirstOrDefault(d => d.ArticleNr.Equals(prod.Article));
                if (foundProduct == null)
                {
                    Children.Add(prodData);
                }
                else
                {
                    foundProduct.Images = prodData.Images;
                    foundProduct.ImagesBaseUrl = prodData.ImagesBaseUrl;
                    foundProduct.Price = prodData.Price;
                }
            }

        }

        public override string Type => "category";
        public string Name { get; set; }
        public int CatId { get; set; }
        public int OrgParentId { get; set; }

    }

    public class ProductCategoryHolder : BaseNode
    {
        public ProductCategoryHolder()
        {
            //Task.Delay(1000).ContinueWith(async (arg) => { await SyncCategories(); });
            PropertyChanged += async (sender, e) =>
            {
                if (e.PropertyName == "LanguageId")
                {
                    if (!string.IsNullOrEmpty(LanguageId))
                    {
                        await SyncCategories();
                    }
                }
            };
        }

        public string LanguageId { get; set; }

        public async Task SyncCategories()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("X-ZUMO-APPLICATION", "MBzVPeguJZtQFDtrFohMjaHmwFQvYc30");
            var jsonString = await client.GetStringAsync("https://cit-api-search-exp-stream01-qa-api.azurewebsites.net/api/Category?languageId=" + LanguageId);
            var cats = JsonConvert.DeserializeObject<List<CoCategory>>(jsonString);

            foreach (var cat in cats.Where(d => d.ParentId != 0))
            {
                var parent = cats.FirstOrDefault(d => d.CategoryId == cat.ParentId);
                parent.Categories.Add(cat);
            }

            foreach (var cat in cats.Where(d => d.ParentId == 0))
            {
                if (!Children.OfType<ProductCategory>().Any(d => d.CatId == cat.CategoryId))
                    Children.Add(new ProductCategory(cat));
            }

        }

        public override string Type => "categoryholder";


    }
}
