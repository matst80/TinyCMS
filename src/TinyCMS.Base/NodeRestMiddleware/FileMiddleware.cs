using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TinyCMS.Interfaces;
using System.Linq;
using TinyCMS.Storage;
using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Security.Permissions;
using Newtonsoft.Json;
using TinyCMS.Serializer;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Policy;
using Microsoft.AspNetCore.Http.Extensions;

namespace TinyCMS.Base
{
    public class JsonResult
    {
        public IDirectory[] Directories { get; set; }
        public IFile[] Files { get; set; }
    }

    public class StorageMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IFileStorageService fileStorage;
        private readonly INodeSerializer serializer;

        public StorageMiddleware(RequestDelegate next, IFileStorageService fileStorage, INodeSerializer serializer)
        {
            _next = next;
            this.fileStorage = fileStorage;
            this.serializer = serializer;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var pathValue = context.Request.Path.Value.TrimEnd('/').TrimStart('/');
            var pathParts = context.Request.Path.Value.Split('/');
            if (pathParts.Length > 0 && context.Request.Path.StartsWithSegments("/files"))
            {
                var token = GetAuthorizarionToken(context);
                var isFile = pathParts.Last().Contains(".");

                if (isFile)
                {
                    var file = fileStorage.GetFile(pathValue);
                    if (context.Request.Method == "POST")
                    {
                        using (var fileStream = file.OpenWrite())
                        {
                            context.Response.ContentType = "application/json";

                            var frm = context.Request.Form;
                            foreach(var formFile in frm.Files)
                            {
                                formFile.CopyTo(fileStream);
                                break;
                            }

                            await fileStream.FlushAsync();
                            context.Response.StatusCode = 200;
                            serializer.WriteValue(context.Response.Body, token, file);
                        }
                    }
                    else
                    {
                        if (file != null && file.Exists)
                        {
                            using (var fileStream = file.OpenRead())
                            {
                                await fileStream.CopyToAsync(context.Response.Body);
                                await context.Response.Body.FlushAsync();
                            }
                        }
                        else
                            await _next(context);
                    }
                }
                else
                {
                    var directory = fileStorage.GetDirectory(pathValue);
                    if (directory != null)
                    {
                        context.Response.ContentType = "application/json";
                        context.Response.StatusCode = 200;
                        var files = directory.GetFiles().ToArray();
                        var directories = directory.GetDirectories().ToArray();
                        serializer.WriteValue(context.Response.Body, token, new JsonResult()
                        {
                            Directories = directories,
                            Files = files
                        });
                        await context.Response.WriteAsync("\n");
                        await context.Response.Body.FlushAsync();
                    }
                    else
                        await _next(context);
                }


            }
            else
            {
                await _next(context);
            }
        }

        private string GetAuthorizarionToken(HttpContext context)
        {
            string authToken = string.Empty;

            if (context.Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                if (authHeader.LastOrDefault() is string authKey)
                {
                    return authKey;
                }
            }

            return string.Empty;
        }
    }
}
