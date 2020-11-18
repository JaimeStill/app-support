using System.Linq;

using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

using AppSupport.Core.Banner;
using AppSupport.Core.Extensions;
using AppSupport.Core.Logging;
using AppSupport.Core.Upload;
using AppSupport.Data;
using AppSupport.Identity;
using AppSupport.Identity.Mock;
using AppSupport.Office;
using AppSupport.Web.Hubs;

namespace AppSupport.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }
        public LogProvider Logger { get; }
        public OfficeConfig OfficeConfig { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
            Logger = new LogProvider
            {
                LogDirectory = Configuration.GetValue<string>("LogDirectory")
                    ?? $@"{Environment.WebRootPath}\logs"
            };

            OfficeConfig = new OfficeConfig
            {
                Directory = Configuration.GetValue<string>("OfficeDirectory")
                    ?? $@"{Environment.WebRootPath}\office"
            };
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                });

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
                options.UseSqlServer(Configuration.GetConnectionString("Project"));
            });

            services.AddSignalR();

            services.AddSingleton(new BannerConfig
            {
                Label = Configuration.GetValue<string>("AppBannerLabel"),
                Background = Configuration.GetValue<string>("AppBannerBackground"),
                Color = Configuration.GetValue<string>("AppBannerColor")
            });

            services.AddSingleton(OfficeConfig);

            if (Environment.IsDevelopment())
            {
                services.AddSingleton(new UploadConfig
                {
                    DirectoryBasePath = $@"{Environment.ContentRootPath}/wwwroot/files/",
                    UrlBasePath = "/files/"
                });

                services
                    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);

                services.AddScoped<IUserProvider, MockProvider>();
            }
            else
            {
                services.AddSingleton(new UploadConfig
                {
                    DirectoryBasePath = Configuration.GetValue<string>("AppDirectoryBasePath"),
                    UrlBasePath = Configuration.GetValue<string>("AppUrlBasePath")
                });

                services.AddScoped<IUserProvider, AdUserProvider>();
            }
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseStaticFiles();

            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseAuthentication();
                app.UseMockMiddleware();
            }
            else
            {
                app.UseAdMiddleware();
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Logger.LogDirectory),
                RequestPath = "/logs"
            });

            app.UseDirectoryBrowser(new DirectoryBrowserOptions
            {
                FileProvider = new PhysicalFileProvider(Logger.LogDirectory),
                RequestPath = "/logs"
            });

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(OfficeConfig.Directory),
                RequestPath = "/office"
            });

            app.UseExceptionHandler(err => err.HandleError(Logger));

            app.UseRouting();

            app.UseCors(builder =>
            {
                builder.WithOrigins(GetConfigArray("CorsOrigins"))
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithExposedHeaders("Content-Disposition");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SyncHub>("/sync");
            });
        }

        string[] GetConfigArray(string section) => Configuration.GetSection(section)
            .GetChildren()
            .Select(x => x.Value)
            .ToArray();
    }
}
