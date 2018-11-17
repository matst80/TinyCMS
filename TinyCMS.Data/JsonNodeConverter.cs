using System;
using TinyCMS.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using System.Collections.Generic;
using TinyCMS.Serializer;

namespace TinyCMS.FileStorage
{

    public class JsonNodeConverter : JsonConverter
    {
        public JsonNodeConverter(INodeTypeFactory typeFactory)
        {
            this.typeFactory = typeFactory;
        }

        private readonly Type NodeInterfaceType = typeof(INode);

        readonly INodeTypeFactory typeFactory;

        public override bool CanConvert(Type objectType)
        {
            return NodeInterfaceType.IsAssignableFrom(objectType);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null)
                return null;

            JObject jObject = JObject.Load(reader);

            var target = CreateNode(jObject);

            serializer.Populate(jObject.CreateReader(), target);

            return target;

        }

        private object CreateNode(JObject jObject)
        {
            var typeValue = jObject.GetValue("type");
            var nodeType = typeValue.ToString();
            return typeFactory.GetNew(nodeType);
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
