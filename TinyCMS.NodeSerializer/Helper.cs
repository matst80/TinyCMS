using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TinyCMS.Interfaces;

namespace TinyCMS.Serializer
{
    public static class Helper
    {
        public static string ToLowerFirst(this string s)
        {
            return Char.ToLowerInvariant(s[0]) + s.Substring(1);
        }
        private static string[] NODE_PROPERTIES = { "Id", "ParentId", "Children", "Tags", "Type", "IsParsed" };

        private static Dictionary<Type, Dictionary<string, PropertyInfo>> props =
            new Dictionary<Type, Dictionary<string, PropertyInfo>>();

        public static Dictionary<string, object> GetProperties(this object o, params string[] excludedProperties)
        {
            Dictionary<string, PropertyInfo> dict = null;
            var ret = new Dictionary<string, object>();
            var t = o.GetType();
            if (props.ContainsKey(t))
                dict = props[t];
            else
            {
                dict = new Dictionary<string, PropertyInfo>();
                var isNode = o is INode;
                var prps = t.GetProperties().Where(d => d.CanRead);
                if (isNode)
                    prps = prps.Where(d => !NODE_PROPERTIES.Contains(d.Name));
                if (isNode && excludedProperties.Any())
                    prps = prps.Where(d => !excludedProperties.Contains(d.Name));
                foreach (var prp in prps)
                {
                    var key = prp.Name.ToLowerFirst();
                    dict.Add(key, prp);
                }
                props.Add(t, dict);
            }
            foreach (var kv in dict)
            {
                var val = kv.Value.GetValue(o, null);
                if (val != null)
                {
                    ret.Add(kv.Key, val);
                }
            }
            return ret;
        }
    }


}
