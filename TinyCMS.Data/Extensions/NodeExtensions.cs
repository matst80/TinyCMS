using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using TinyCMS.Data.Nodes;
using System.Collections;
using Newtonsoft.Json.Linq;
using TinyCMS.Interfaces;

namespace TinyCMS.Data.Extensions
{
    public static class NodeExtensions
    {
        public static INode Add(this INode that, INode child)
        {
            if (that.Children == null)
                that.Children = new ObservableCollection<INode>();
            if (string.IsNullOrEmpty(child.Id))
            {
                child.Id = Guid.NewGuid().ToString();
            }
            child.ParentId = that.Id;
            that.Children.Add(child);
            return that;
        }

        public static INode Add<T>(this INode that) where T : INode
        {
            var ne = Activator.CreateInstance<T>();
            that.Add(ne);
            return that;
        }

        public static INode Watch(this INode node, Action onChange)
        {
            node.PropertyChanged += (sender, e) => {
                onChange.Invoke();
            };

            node.Children.CollectionChanged += (sender, e) => {
                onChange.Invoke();
            };
            return node;
        }

        public static INode Add(this INode that, INode node, IDictionary<string, object> data)
        {
            that.Add(node.Apply(data));
            return that;
        }

        public static INode Apply(this INode that, IDictionary<string, object> data)
        {
            if (that == null)
                return null;
            var nt = that.GetType();
            var prps = nt.GetProperties().ToList();
            foreach (var key in data.Keys)
            {
                var prp = prps.FirstOrDefault(d => d.Name.Equals(key, StringComparison.InvariantCultureIgnoreCase));
                var val = data[key];
                if (prp != null && val != null)
                {
                    try
                    {
                        if (val is JObject jobj)
                        {
                            val = jobj.ToObject<Dictionary<string, object>>();
                        }
                        prp.SetValue(that, Convert.ChangeType(val, prp.PropertyType),null);
                    }
                    catch(Exception ex) {
                        var i = 2;
                    }
                }
            }
            return that;
        }

        public static INode AddBlogPage(this INode that, string id = "")
        {
            that.Add(new Page()
            {
                Id = id,
                Name = "Blogpost"
            }.Add(new Image()
            {
                Path = "/image.jpg"
            }).Add(new Text()
            {
                Value = "Blog title"
            }).Add(new Text()
            {
                Value = "Blog text, lorem ipsum"
            }));
            return that;
        }
    }
}
