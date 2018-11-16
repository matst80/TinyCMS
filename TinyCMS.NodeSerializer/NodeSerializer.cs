﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using TinyCMS.Data;
using TinyCMS.Interfaces;
using TinyCMS.Data.Extensions;

namespace TinyCMS.Serializer
{

    public class NodeSerializer : INodeSerializer
    {
        private IContainer _container;
        public NodeSerializer(IContainer cont)
        {
            _container = cont;
        }

        private const byte FnuttByte = (byte)'"';
        private const byte ColonByte = (byte)':';
        private const byte TrueByte = (byte)'1';
        private const byte FalseByte = (byte)'0';
        private const byte CommaByte = (byte)',';
        private const byte ObjectStart = (byte)'{';
        private const byte ObjectEnd = (byte)'}';
        private const byte ArrayStart = (byte)'[';
        private const byte ArrayEnd = (byte)']';

        public ArraySegment<byte> ToArraySegment(INode node, int depth = 99, int level = 0, bool fetchRelations = true)
        {
            var stream = new MemoryStream();
            StreamSerialize(node, stream, depth, level, fetchRelations);
            var ret = new ArraySegment<byte>();
            stream.TryGetBuffer(out ret);
            return ret;
        }

        public ArraySegment<byte> ToArraySegment(INode node, ISerializerSettings settings)
        {
            return ToArraySegment(node, settings.Depth, settings.Level, settings.IncludeRelations);

        }

        public void StreamSerialize(INode node, Stream output, int depth = 99, int level = 0, bool fetchRelations = true, params string[] excludedProperties)
        {
            output.WriteByte(ObjectStart);
            if (node != null)
            {
                WriteKeyAndValue(output, "id", node.Id);
                output.WriteByte(CommaByte);
                WriteKeyAndValue(output, "type", node.Type);
                bool hasChildren = node.Children != null && node.Children.Any();
                bool useParentId = !string.IsNullOrEmpty(node.ParentId) && level < 1;
                bool hasTags = node.Tags != null && node.Tags.Any();
                var extraPrps = node.GetPropertyDictionary(excludedProperties);
                bool hasRelations = fetchRelations;
                IEnumerable<INode> relations = null;
                if (hasRelations)
                {
                    relations = _container.GetRelations(node);
                    hasRelations = relations.Any();
                }
                bool hasExtra = extraPrps.Keys.Any();

                if (useParentId)
                {
                    output.WriteByte(CommaByte);
                    WriteKeyAndValue(output, "parentId", node.ParentId);
                }
                if (hasChildren)
                {
                    output.WriteByte(CommaByte);
                    output.WriteByte(FnuttByte);
                    WriteString(output, "children");
                    output.WriteByte(FnuttByte);
                    output.WriteByte(ColonByte);
                    output.WriteByte(ArrayStart);
                    var isFirst = true;
                    foreach (var child in node.Children)
                    {
                        if (!isFirst)
                        {
                            output.WriteByte(CommaByte);
                        }
                        StreamSerialize(child, output, depth, level + 1, level < 2, excludedProperties);
                        isFirst = false;
                    }
                    output.WriteByte(ArrayEnd);
                }
                if (hasRelations)
                {
                    output.WriteByte(CommaByte);
                    output.WriteByte(FnuttByte);
                    WriteString(output, "relations");
                    output.WriteByte(FnuttByte);
                    output.WriteByte(ColonByte);
                    output.WriteByte(ArrayStart);
                    var isFirst = true;
                    foreach (var child in relations)
                    {
                        if (!isFirst)
                        {
                            output.WriteByte(CommaByte);
                        }
                        StreamSerialize(child, output, depth, level + 1, false, excludedProperties);
                        isFirst = false;
                    }
                    output.WriteByte(ArrayEnd);
                }
                if (hasExtra)
                {
                    output.WriteByte(CommaByte);
                    var isFirst = true;
                    foreach (var p in extraPrps)
                    {

                        if (!isFirst)
                        {
                            output.WriteByte(CommaByte);
                        }
                        WriteKeyAndValue(output, p.Key, p.Value);
                        isFirst = false;

                    }
                }
            }
            output.WriteByte(ObjectEnd);
        }

        public void WriteValue(Stream output, object value)
        {
            if (value is string valueString)
            {
                output.WriteByte(FnuttByte);
                WriteString(output, valueString.Replace("\n", "\\n").Replace("\r", "\\r").Replace("\t", "\\t").Replace("\"", "\\\""));
                output.WriteByte(FnuttByte);
            }
            else if (value is bool b)
            {
                output.WriteByte(b ? TrueByte : FalseByte);
            }
            else if (value is DateTime dt)
            {
                WriteString(output, dt.Ticks.ToString());
            }
            else if (value is int || value is float || value is double)
            {
                WriteString(output, value.ToString());
            }
            else if (value is Dictionary<string, object> dictionary)
            {
                output.WriteByte(ObjectStart);
                var isFirst = true;
                foreach (var kv in dictionary)
                {
                    if (!isFirst)
                    {
                        output.WriteByte(CommaByte);
                    }
                    WriteKeyAndValue(output, kv.Key, kv.Value);
                    isFirst = false;
                }
                output.WriteByte(ObjectEnd);
            }
            else if (value is IEnumerable array)
            {
                var isFirst = true;
                output.WriteByte(ArrayStart);
                foreach (object item in array)
                {
                    if (!isFirst)
                    {
                        output.WriteByte(CommaByte);
                    }
                    if (item is INode node)
                    {
                        StreamSerialize(node, output, 2);
                    }
                    else
                        WriteKeyAndValue(output, null, item);
                    isFirst = false;
                }
                output.WriteByte(ArrayEnd);
            }
            else
            {
                var prps = value.GetPropertyDictionary();
                output.WriteByte(ObjectStart);
                var isFirst = true;
                foreach (var p in prps)
                {

                    if (!isFirst)
                    {
                        output.WriteByte(CommaByte);
                    }
                    WriteKeyAndValue(output, p.Key, p.Value);
                    isFirst = false;

                }
                output.WriteByte(ObjectEnd);
            }
        }

        private void WriteKeyAndValue(Stream output, string str, object value)
        {
            if (value == null)
                return;
            if (str != null)
            {
                WriteKey(output, str);
            }

            WriteValue(output, value);
        }

        private void WriteKey(Stream output, string str)
        {
            output.WriteByte(FnuttByte);
            WriteString(output, str);
            output.WriteByte(FnuttByte);
            output.WriteByte(ColonByte);
        }

        private void WriteString(Stream s, string v)
        {
            var sendData = Encoding.UTF8.GetBytes(v);
            s.Write(sendData, 0, sendData.Length);
        }

        public void StreamSchema(Type type, Stream output)
        {
            output.WriteByte(ObjectStart);
            WriteKeyAndValue(output, "id", SchemaTypeAttribute.SCHEMA_PREFIX + type.Name.ToLowerFirst() + ".schema.json");
            if (type.GetCustomAttribute(typeof(System.ComponentModel.DescriptionAttribute)) is System.ComponentModel.DescriptionAttribute description)
            {
                output.WriteByte(CommaByte);
                WriteKeyAndValue(output, "description", description.Description);
            }
            output.WriteByte(CommaByte);
            WriteKeyAndValue(output, "type", "object");
            output.WriteByte(CommaByte);
            WriteKey(output, "properties");
            output.WriteByte(ObjectStart);
            WriteSchemaProperties(type, output);
            output.WriteByte(ObjectEnd);
            output.WriteByte(ObjectEnd);
        }

        private void WriteSchemaProperties(Type type, Stream output)
        {
            var isFirst = true;
            foreach (var property in type.GetProperties().Where(d => d.Name != "IsParsed"))
            {
                if (!isFirst)
                {
                    output.WriteByte(CommaByte);
                }
                WriteKey(output, property.Name.ToLowerFirst());
                output.WriteByte(ObjectStart);
                var keyAndValue = GetTypeName(property);
                WriteKeyAndValue(output, keyAndValue.Item1, keyAndValue.Item2);

                if (property.GetCustomAttribute(editorType) is EditorTypeAttribute editorAttr)
                {
                    output.WriteByte(CommaByte);
                    WriteKeyAndValue(output, "editor", editorAttr.Editor);
                }
                output.WriteByte(ObjectEnd);
                isFirst = false;
            }
        }

        private static Type schemaType = typeof(SchemaTypeAttribute);
        private static Type editorType = typeof(EditorTypeAttribute);

        private Tuple<string, string> GetTypeName(PropertyInfo propertyInfo)
        {
            var key = "type";
            var value = propertyInfo.PropertyType.Name.ToLowerFirst();
            if (propertyInfo.GetCustomAttribute(schemaType) is SchemaTypeAttribute customSchema)
            {
                key = "$ref";
                value = customSchema.Schema;
            }
            return Tuple.Create<string, string>(key, value);
        }
    }


}