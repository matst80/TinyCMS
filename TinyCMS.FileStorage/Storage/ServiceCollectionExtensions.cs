using System;
using Microsoft.Extensions.DependencyInjection;
using TinyCMS.Storage;

namespace TinyCMS.FileStorage.Storage
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddFileStorage(this IServiceCollection services)
        {
            return services
                .AddTransient<IFile, File>()
                .AddTransient<IDirectory, Directory>()
                .AddSingleton<IFileStorageService, FileStorageService>();
        }
    }
}
