using System.Collections.Generic;
using TinyCMS.Interfaces;

namespace TinyCMS
{
    public class SerializerSettings : ISerializerSettings
    {
        public void FromRequest(INodeRequest request)
        {
            FromQueryString(request.QueryString);
        }

        public void FromQueryString(Dictionary<string, string> queryString)
        {
            if (queryString.ContainsKey("rel"))
            {
                IncludeRelations = queryString["rel"] == "1";
            }
            if (queryString.ContainsKey("depth"))
            {
                int levels = 3;
                if (int.TryParse(queryString["depth"], out levels))
                {
                    Depth = levels;
                }
            }
            if (queryString.ContainsKey("level"))
            {
                int level = 0;
                if (int.TryParse(queryString["level"], out level))
                {
                    Level = level;
                }
            }
        }

        public int Depth { get; set; } = 3;

        public int Level { get; set; } = 0;

        public bool IncludeRelations { get; set; } = true;
    }
}
