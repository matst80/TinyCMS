using System;

namespace TinyCMS.Data.Builder
{
    
    internal class NotUniqueIdException : Exception
    {
        public NotUniqueIdException()
        {
        }

        public NotUniqueIdException(string message) : base(message)
        {
        }

        public NotUniqueIdException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
