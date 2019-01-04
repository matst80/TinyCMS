using GraphQL.Types;
using TinyCMS.Interfaces;
using System.Linq;
using System;
using GraphQL;
using System.Reflection;

namespace TinyCMS.GraphQL
{
    public class NodeReflectionGraphType : ObjectGraphType<INode>
    {
        private static string[] CONSTANT_PROPERTIES = { "Children", "Type", "Id", "ParentId" };
        private readonly IContainer container;

        private bool IsValidProperty(PropertyInfo d)
        {
            return (
                d.CanRead &&
                !CONSTANT_PROPERTIES.Contains(d.Name) &&
                (d.PropertyType.GetTypeInfo().IsValueType || d.PropertyType == typeof(string))
            );
        }

        public NodeReflectionGraphType(string name, Type type, IContainer container) : this()
        {
            Name = name;
            foreach (var prp in type.GetProperties().Where(IsValidProperty))
            {
                try
                {
                    var graphType = prp.PropertyType.GetGraphTypeFromType(prp.PropertyType.IsNullable());
                    if (graphType != null)
                    {
                        Field(graphType, prp.Name, resolve: (ctx) =>
                        {
                            return prp.GetValue(ctx.Source);
                        });
                    }
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    Field(typeof(StringGraphType), prp.Name, resolve: (ctx) =>
                    {
                        return prp.GetValue(ctx.Source).ToString();
                    });
                }
            }

            this.container = container;
        }

        public NodeReflectionGraphType()
        {
            var type = this.GetType();
            Field(h => h.Id).Description("The id of the node.");
            Field(h => h.Type).Description("The type of the node.");
            Field(h => h.ParentId, true).Description("The parentId of the node.");

            Field<ListGraphType<NodeReflectionGraphType>>(
                "Children",
                resolve: context => context.Source.Children
            );

            Field<ListGraphType<NodeReflectionGraphType>>(
                "Relations",
                resolve: context => container?.GetRelationsById(context.Source.Id)
            );
        }
    }
}