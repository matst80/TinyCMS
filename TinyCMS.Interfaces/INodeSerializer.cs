using System;
using System.IO;
using TinyCMS.Interfaces;

namespace TinyCMS.Interfaces
{
    public interface INodeSerializer
    {
        void StreamSchema(Type type, Stream output);
        void StreamSerialize(INode node, Stream output, int depth = 99, int level = 0, bool fetchRelations = true, params string[] excludedProperties);
        ArraySegment<byte> ToArraySegment(INode node, int depth = 99, int level = 0, bool fetchRelations = true);
        ArraySegment<byte> ToArraySegment(INode node, ISerializerSettings settings);
        void WriteValue(Stream output, object value);
    }
}