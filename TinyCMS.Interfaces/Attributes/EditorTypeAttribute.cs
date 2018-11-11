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
}
