﻿using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using TinyCMS.Data.Builder;
using TinyCMS.Serializer;

namespace TinyCMS.Commerce
{
    public class JsonMappedInterfaceConverter : JsonConverter
    {
        public JsonMappedInterfaceConverter(InterfaceResolverFactory interfaceResolver)
        {
            this.interfaceResolver = interfaceResolver;
        }

        private readonly InterfaceResolverFactory interfaceResolver;

        public override bool CanConvert(Type objectType)
        {
            return interfaceResolver.CanResolve(objectType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null)
                return null;

            JObject jObject = JObject.Load(reader);

            var target = interfaceResolver.CreateInstance(objectType);

            serializer.Populate(jObject.CreateReader(), target);

            return target;

        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            JObject jo = new JObject();
            foreach (var prop in value.GetPropertyInfoList())
            {
                var propertyValue = prop.Value.GetValue(value);
                if (propertyValue != null)
                {
                    jo.Add(prop.Key, JToken.FromObject(propertyValue, serializer));
                }
            }
            jo.WriteTo(writer);
        }
    }
}
