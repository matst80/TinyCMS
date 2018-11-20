using System.Collections.Generic;
using Newtonsoft.Json;
using TinyCMS.Interfaces;
using Newtonsoft.Json.Linq;

namespace TinyCMS
{
    public class SocketRequest : INodeRequest
    {
        public SocketRequest()
        {

        }

        public SocketRequest(string request)
        {
            Parse(request);
        }

        public SocketRequest(byte[] data, int length)
        {
            Parse(System.Text.Encoding.UTF8.GetString(data, 0, length));
        }

        public Dictionary<string, string> QueryString { get; internal set; } = new Dictionary<string, string>();

        public JObject JsonData { get; internal set; }

        public RequestTypeEnum RequestType { get; internal set; }

        public string Data { get; internal set; }

        public ISerializerSettings GetSerializerSettings()
        {
            var settings = new SerializerSettings();
            settings.FromRequest(this);
            return settings;
        }

        private void Parse(string request)
        {

            if (request.Length > 1)
            {
                if (request.StartsWith("##"))
                {
                    var token = request.Substring(2, request.Length - 4);
                    RequestType = RequestTypeEnum.AuthToken;
                    Data = token;
                    return;
                }

                switch (request[0])
                {
                    case '?':
                        RequestType = RequestTypeEnum.Get;
                        break;
                    case '=':
                        RequestType = RequestTypeEnum.Update;
                        break;
                    case '+':
                        RequestType = RequestTypeEnum.Add;
                        break;
                    case '-':
                        RequestType = RequestTypeEnum.Remove;
                        break;
                    case '!':
                        RequestType = RequestTypeEnum.Link;
                        break;
                }
                var data = request.Substring(1);
                var splitIdx = data.IndexOf(':');
                var firstJsonObj = data.IndexOf('{');
                if (firstJsonObj > splitIdx && splitIdx > 0)
                {
                    var query = data.Substring(0, splitIdx);
                    var content = data.Substring(splitIdx + 1);
                    var queryDict = new Dictionary<string, string>();
                    var queryParts = query.Split('&');

                    foreach (var queryPart in queryParts)
                    {
                        var keyAndValue = queryPart.Split('=');
                        string value = "1";
                        if (keyAndValue.Length > 1)
                        {
                            value = keyAndValue[1];
                        }
                        queryDict.Add(keyAndValue[0], value);
                    }
                    QueryString = queryDict;

                    Data = content;
                }
                else
                {
                    Data = data;
                }
                if (!string.IsNullOrEmpty(Data) && Data.Contains("{"))
                {
                    try
                    {
                        JsonData = JObject.Parse(Data);
                        //JsonData = JsonConvert.DeserializeObject<Dictionary<string, object>>(Data);
                    }
                    catch 
                    {
                        // corrupted data
                    }
                }
            }
        }
    }
}
