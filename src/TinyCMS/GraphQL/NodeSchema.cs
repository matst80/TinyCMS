using System;
using GraphQL.Types;
using GraphQL;
using TinyCMS.Interfaces;
using System.Collections.Generic;
using GraphQL.Resolvers;
using TinyCMS.Serializer;

namespace TinyCMS.GraphQL
{
    public class NodeSchema : Schema
    {


        public NodeSchema(IDependencyResolver dependencyResolver, INodeTypeFactory factory, IContainer container) : base(dependencyResolver)
        {
            this.Query = new NodeQuery(container, factory);
            this.Mutation = new NodeMutation(container, factory);
        }
    }

    public class NodeType : IGraphType
    {
        public string Description { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
        public string DeprecationReason { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        public IDictionary<string, object> Metadata => throw new NotImplementedException();

        public string Name { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        public string CollectTypes(TypeCollectionContext context)
        {
            throw new NotImplementedException();
        }

        public TType GetMetadata<TType>(string key, TType defaultValue = default(TType))
        {
            throw new NotImplementedException();
        }

        public bool HasMetadata(string key)
        {
            throw new NotImplementedException();
        }
    }

    public class NodeResolver : IFieldResolver
    {
        private readonly IContainer container;

        public NodeResolver(IContainer container)
        {
            this.container = container;
        }

        public object Resolve(ResolveFieldContext context)
        {
            var id = context.GetArgument<string>("id");
            return container.GetById(id);
        }
    }

    public class NodeGraphType : IGraphType
    {
        private readonly IDictionary<string, object> metadata;

        public NodeGraphType(string typeName, Type nodeType)
        {
            metadata = new Dictionary<string, object>();
            Name = typeName;

        }

        public string Description { get; set; }
        public string DeprecationReason { get; set; }

        public IDictionary<string, object> Metadata => metadata;

        public string Name { get; set; }

        public string CollectTypes(TypeCollectionContext context)
        {
            return Name;
        }

        protected bool Equals(IGraphType other)
        {
            return string.Equals(Name, other.Name);
        }

        public TType GetMetadata<TType>(string key, TType defaultValue = default(TType))
        {
            if (!HasMetadata(key))
            {
                return defaultValue;
            }

            if (Metadata.TryGetValue(key, out var item))
            {
                return (TType)item;
            }

            return defaultValue;
        }

        public bool HasMetadata(string key)
        {
            return Metadata?.ContainsKey(key) ?? false;
        }

        public override int GetHashCode()
        {
            return Name?.GetHashCode() ?? 0;
        }
    }

    public class NodeQueryOld : ObjectGraphType<object>
    {
        private readonly IContainer container;

        public NodeQueryOld(IContainer container, INodeTypeFactory factory)
        {
            this.container = container;
            Name = "Query";
            Field(typeof(BaseNodeType), "root", resolve: context => container.RootNode);
            Field(
                typeof(BaseNodeType),
                "node",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "id", Description = "id of the human" }
                    ),
                resolve: context => container.GetById(context.GetArgument<string>("id"))
            );

            //var generic = typeof(NodeType<>);

            //foreach (var typeName in factory.RegisterdTypeNames())
            //{
            //    var type = factory.GetTypeByName(typeName);
            //    var genericType = generic.MakeGenericType(type);
            //    Field(
            //        genericType,
            //        typeName,
            //        arguments: new QueryArguments(
            //            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "id", Description = "id of the human" }
            //        ),
            //        resolve: context => container.GetById(context.GetArgument<string>("id")));
            //}
        }
    }

    public class NodeMutation : ObjectGraphType
    {
        private readonly IContainer container;

        public NodeMutation(IContainer container, INodeTypeFactory factory)
        {
            var generic = typeof(NodeType<>);

            foreach (var typeName in factory.RegisterdTypeNames())
            {
                var type = factory.GetTypeByName(typeName);
                var genericType = generic.MakeGenericType(type);
                Field(genericType,
                typeName,
                resolve: context =>
                {
                    return factory.GetNew(typeName);
                    //return data.AddHuman(human);
                });
            }
        }
    }
}
