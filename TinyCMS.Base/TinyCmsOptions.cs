using System;
using TinyCMS.Data.Builder;
using TinyCMS.Interfaces;
using System.Collections.Generic;
using System.Reflection;
using TinyCMS.Data;
using TinyCMS.FileStorage;
using TinyCMS.Serializer;
using TinyCMS.Security;

namespace TinyCMS.Base
{
    public class TinyCmsOptions
    {
        public Assembly GetAssembly(Type type) => type.Assembly;

        public TinyCmsOptions()
        {
            AddAssemblyWithNodes<BaseNode>();
        }

        public void AddAssemblyWithNodes(Assembly asm)
        {
            AssembliesWithNodes.Add(asm);
        }

        public void AddAssemblyWithNodes(Type type)
        {
            AddAssemblyWithNodes(GetAssembly(type));
        }

        public void AddAssemblyWithNodes<T>()
        {
            AddAssemblyWithNodes(typeof(T));
        }

        internal void RegisterAssemblys(INodeTypeFactory factory)
        {
            foreach (var asm in AssembliesWithNodes)
            {
                factory.RegisterTypes(asm);
            }
        }

        public List<Assembly> AssembliesWithNodes = new List<Assembly>();
        public Type NodeContainer { get; set; } = typeof(Container);
        public Type NodeTypeFactory { get; set; } = typeof(NodeTypeFactory);
        public Type NodeStorage { get; set; } = typeof(NodeFileStorage<Container>);
        public Type NodeSerializer { get; set; } = typeof(NodeSerializer);
        public Type StorageService { get; set; } = typeof(JsonStorageService);
        public Type TokenValidator { get; set; } = typeof(GoogleTokenValidator);

        private INodeTypeFactory _factory;
        public INodeTypeFactory NodeFactoryInstance
        {
            get
            {
                if (_factory == null)
                {
                    _factory = Activator.CreateInstance(NodeTypeFactory) as INodeTypeFactory;
                    RegisterAssemblys(_factory);
                }
                return _factory;
            }
        }

        public IJWTSettings JWTSettings { get; set; } = new JWTSettings("developmentkey-change-this-setting");
        public bool UseAuthentication { get; set; } = true;
    }
}
