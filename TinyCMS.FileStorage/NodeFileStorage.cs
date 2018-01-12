using System;
using System.IO;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using System.Runtime.Serialization.Formatters.Binary;
using System.Runtime.Serialization;


namespace TinyCMS.FileStorage
{
    public class NodeFileStorage : INodeStorage
    {
        public Container Load()
        {
            Container ret = null;

            // Open the file containing the data that you want to deserialize.
            FileStream fs = new FileStream("DataFile.dat", FileMode.Open);
            try
            {
                BinaryFormatter formatter = new BinaryFormatter();

                // Deserialize the hashtable from the file and 
                // assign the reference to the local variable.
                ret = (Container)formatter.Deserialize(fs);
            }
            catch (SerializationException e)
            {
                Console.WriteLine("Failed to deserialize. Reason: " + e.Message);
                throw;
            }
            finally
            {
                fs.Close();
            }
            return ret;
        }

        public void Store(Container cnt)
        {
            FileStream fs = new FileStream("DataFile.dat", FileMode.Create);

            // Construct a BinaryFormatter and use it to serialize the data to the stream.
            BinaryFormatter formatter = new BinaryFormatter();
            try
            {
                formatter.Serialize(fs, cnt);
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
