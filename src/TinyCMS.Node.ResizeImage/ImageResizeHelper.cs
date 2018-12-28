using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace TinyCMS.Node.ResizeImage
{
    public class ImageResizeHelper
    {
        private static ImageResizeHelper instance;
        public static ImageResizeHelper Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new ImageResizeHelper();
                }
                return instance;
            }
        }

        private string backendUrl = "http://localhost:5000/schema/";
        private Type responeType = typeof(DefaultResizeResponse);

        public ImageResizeHelper SetResizeBackendUrl(string url)
        {
            backendUrl = url;
            return this;
        }

        public ImageResizeHelper SetResponseType(Type responseType)
        {
            this.responeType = responseType;
            return this;
        }

        public event EventHandler<IResizeResponse> ImageResized;

        public void GetResizedImageUrl(string downloadUrl, Action<IResizeResponse> onTokenFetched)
        {
            Task.Run(async () =>
            {
                try
                {
                    var client = new HttpClient();
                    var requestObj = new DefaultResizeRequest() { 
                        Url = downloadUrl
                    };
                    var response = await client.PostAsync(backendUrl, new StringContent(JsonConvert.SerializeObject(requestObj)));
                    if (response.IsSuccessStatusCode)
                    {

                        var stringData = await response.Content.ReadAsStringAsync();
                        if (JsonConvert.DeserializeObject(stringData, responeType) is IResizeResponse data)
                        {
                            if (string.IsNullOrEmpty(data.Token))
                            {
                                onTokenFetched(data);
                                ImageResized?.Invoke(this, data);
                            }
                        }

                    }
                    else
                    {
                        // TODO Maybe add som feature for reporting this
                    }
                }
                catch (Exception ex)
                {
                    // TODO Maybe add som feature for reporting this
                    //throw ex;
                }
            });
        }
    }
}
