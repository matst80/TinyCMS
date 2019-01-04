using System;

namespace TinyCMS.Data
{
    public class EditorTypeAttribute : Attribute
    {
        public EditorTypeAttribute(string editor)
        {
            Editor = editor;
        }

        public string Editor { get; }
    }

    public class NameAttribute : Attribute
    {
        public NameAttribute(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
    }

    public class IgnoreAttribute : Attribute
    {

    }
}
