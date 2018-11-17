using System;
using System.IO;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using TinyCMS.Data.Nodes;
using TinyCMS.Data.Extensions;

namespace TinyCMS.FileStorage
{
    public class NodeFileStorage : INodeStorage
    {
        private Container watchContainer;

        private const string DataFilename = "Nodes.dat";

        public Container Load()
        {
            Container ret = null;

            // Open the file containing the data that you want to deserialize.
            var fileInfo = new FileInfo(DataFilename);
            if (fileInfo.Exists)
            {
                using(var fs = fileInfo.OpenRead())
                {
                    try
                    {
                        BinaryFormatter formatter = new BinaryFormatter();
                        ret = (Container)formatter.Deserialize(fs);
                    }
                    catch (SerializationException e)
                    {
                        Console.WriteLine("Failed to deserialize. Reason: " + e.Message);
#if DEBUG
                        ret = GenerateNewContainerData();
#else
                throw;
#endif
                    }

                }
            }
            else
            {
                ret = GenerateNewContainerData();
            }
            ret.AfterRestore();
            watchContainer = ret;
            Task.Delay(15000).ContinueWith((arg) => StartSaveThread());
            return ret;
        }

        private Container GenerateNewContainerData()
        {
            return new Container(new Site() { Id = "root" }.Add(new Page()
            {
                Name = "Error parsing",
                TemplateId = "page",
                Url = "/error"
            }));
        }

        private void StartSaveThread()
        {
            var wait = 3000;
            if (watchContainer.IsDirty)
            {
                Store(watchContainer);
                wait = 10000;
            }
            Task.Delay(wait).ContinueWith((arg) => StartSaveThread());
        }

        public void Store(Container cnt)
        {
            FileStream fs = new FileStream(DataFilename, FileMode.Create);

            // Construct a BinaryFormatter and use it to serialize the data to the stream.
            BinaryFormatter formatter = new BinaryFormatter();
            try
            {
                formatter.Serialize(fs, cnt);
                cnt.IsDirty = false;
            }
            catch (SerializationException e)
            {
                Console.WriteLine("Failed to serialize. Reason: " + e.Message);
                throw;
            }
            finally
            {
                fs.Close();
            }

        }
    }



    public interface INodeStorage
    {
        void Store(Container cnt);

        Container Load();

    }
}
