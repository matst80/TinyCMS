using System;

namespace TinyCMS.Data
{
    public class SchemaTypeAttribute : Attribute
    {
        public const string SCHEMA_PREFIX = "http://tinycms.com/schema/";

        public SchemaTypeAttribute(string schema, bool isUri = false)
        {
            Schema = (isUri ? "" : SCHEMA_PREFIX) + schema + ".schema.json";
        }

        public string Schema { get; private set; }

    }

    public class EditorTypeAttribute : Attribute
    {
        public EditorTypeAttribute(string editor)
        {
            Editor = editor;
        }

        public string Editor { get; }
    }
}
