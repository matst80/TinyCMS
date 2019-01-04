using GraphQL.Types;
using System.Linq;
using System;
using System.Reflection;
using TinyCMS.Data;
using System.Collections.Generic;
using GraphQL.Utilities;
using GraphQL;

namespace TinyCMS.GraphQL
{
    public class ReflectedFieldType : FieldType
    {
        public PropertyInfo PropertyInfo { get; set; }

    }

    public class ReflectionObjectGraphType<T> : ObjectGraphType<T>
    {
        public Func<PropertyInfo, bool> IsValidProperty { get; set; } = (d) => (
                d.CanRead 
                && d.GetCustomAttribute<IgnoreAttribute>() == null 
                //&& (d.PropertyType.GetTypeInfo().IsValueType || d.PropertyType == typeof(string))
            );

        public Func<ResolveFieldContext<T>, PropertyInfo, object> Resolve { get; set; } = (context, propertyInfo) =>
        {
            return propertyInfo.GetValue(context.Source);
        };

        public List<ReflectedFieldType> ReflectedFields { get; } = new List<ReflectedFieldType>();

        public ReflectionObjectGraphType()
        {
            var type = typeof(T);
            ParseName(type);
            EnumProperties(type);
        }

        private void EnumProperties(Type type)
        {


            foreach (var prp in type.GetProperties().Where(IsValidProperty))
            {

                var graphType = prp.PropertyType.GetGraphTypeFromTypeOrNull(prp.PropertyType.IsNullable());
                if (graphType != null)
                {
                    Field(graphType, prp.Name, resolve: (ctx) =>
                    {
                        return Resolve(ctx, prp);
                    });
                }
            }
        }

        public ReflectionObjectGraphType(string name, object emptyObject = null, Func<PropertyInfo, bool> isValidProperty = null)
        {
            var type = typeof(T);
            if (emptyObject != null)
            {
                type = emptyObject.GetType();
            }
            if (isValidProperty != null)
            {
                IsValidProperty = isValidProperty;
            }
            ParseName(type);
            EnumProperties(type);
        }

        public void ParseName(Type type)
        {
            var nameAttribute = type.GetCustomAttribute<NameAttribute>(true);
            if (nameAttribute != null)
            {
                Name = nameAttribute.Name;
            }
            else
            {
                Name = type.Name;
            }
        }
    }
}