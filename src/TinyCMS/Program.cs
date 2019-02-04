﻿using Microsoft.AspNetCore.Hosting;

namespace TinyCMS
{
    public class Program
    {
        public static void Main(string[] args)
        {
             BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            Microsoft.AspNetCore.WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
