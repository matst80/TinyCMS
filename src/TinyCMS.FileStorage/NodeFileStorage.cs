using System;
using System.IO;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using TinyCMS.Data.Nodes;
using TinyCMS.Data.Extensions;
using TinyCMS.Interfaces;
using System.ComponentModel.Design;

namespace TinyCMS.FileStorage
{
    public class NodeFileStorage<T> : INodeStorage where T : IContainer
    {
        private readonly IStorageService storageService;
        private readonly IServiceProvider serviceContainer;
        private T watchContainer;

        //private const string DataFilename = "Nodes.dat";
        private const string DataFilename = "Nodes.json";

        public NodeFileStorage(IServiceProvider serviceContainer)
        {
            this.storageService = serviceContainer.GetService(typeof(IStorageService)) as IStorageService;
            this.serviceContainer = serviceContainer;
        }

        public IContainer Load()
        {
            T ret = default(T);
            try
            {
                ret = storageService.LoadContainer<T>(DataFilename);
            }
            catch(Exception ex)
            {
                throw ex;
            }
            if ((IContainer)ret == null)
                ret = GenerateNewContainerData();
            var changeHandler = serviceContainer.GetService(typeof(IContainerChangeHandler)) as IContainerChangeHandler;
            if (changeHandler!=null)
                ret.AttachChangeLogger(changeHandler);
            ret.AfterRestore();
            watchContainer = ret;
            Task.Delay(15000).ContinueWith((arg) => StartSaveThread());
            return ret;
        }

        private T GenerateNewContainerData()
        {
            var ret = serviceContainer.GetService(typeof(T)) as IContainer;
            //var ret = Activator.CreateInstance<T>();
            ret.RootNode = new Site() { Id = "root" }.Add(new Page()
            {
                Name = "Error parsing",
                TemplateId = "page",
                Url = "/error"
            });
            return (T)ret;
        }

        private void StartSaveThread()
        {
            var wait = 3000;
            if (watchContainer.IsDirty)
            {
                watchContainer.IsDirty = false;
                Store(watchContainer);
                wait = 10000;
            }
            Task.Delay(wait).ContinueWith((arg) => StartSaveThread());
        }

        public void Store(IContainer container)
        {
            try
            {
                storageService.SaveContainer(container, DataFilename);
            }
            catch (SerializationException e)
            {
                Console.WriteLine("Failed to serialize. Reason: " + e.Message);
                throw;
            }

        }
    }
}
