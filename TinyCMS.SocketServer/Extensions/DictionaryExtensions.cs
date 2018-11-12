using System.Collections.Generic;

namespace TinyCMS.SocketServer
{
    public static class DictionaryExtensions
    {
        public static string GetString(this Dictionary<string, string> dict, string key, string resultIfEmpty = "")
        {
            if (dict != null)
            {
                if (dict.ContainsKey(key))
                    return dict[key];
            }
            return resultIfEmpty;
        }

        public static string GetString(this Dictionary<string, object> dict, string key, string resultIfEmpty = "")
        {
            if (dict != null)
            {
                if (dict.ContainsKey(key))
                    return dict[key].ToString();
            }
            return resultIfEmpty;
        }
    }
}
