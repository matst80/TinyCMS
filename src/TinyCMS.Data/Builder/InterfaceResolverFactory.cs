using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace TinyCMS.Data.Builder
{
    public class InterfaceResolver
    {
        private static InterfaceResolver _instance;
        public static InterfaceResolver Instance {
            get
            {
                if (_instance == null)
                    _instance = new InterfaceResolver();
                return _instance;
            }
        }

        private Dictionary<Type, Type> _typeMapping = new Dictionary<Type, Type>();


        public void Add(Type from, Type to)
        {
            if (!_typeMapping.ContainsKey(from))
                _typeMapping.Add(from, to);
        }

        public void Add<TFrom, TTo>()
        {
            Add(typeof(TFrom), typeof(TTo));
        }

        public bool CanResolve(Type objectType)
        {
            return _typeMapping.ContainsKey(objectType);
        }

        public object CreateInstance(Type objectType)
        {
            if (_typeMapping.ContainsKey(objectType))
            {
                return Activator.CreateInstance(_typeMapping[objectType]);
            }
            return Activator.CreateInstance(objectType);
        }
    }
}
