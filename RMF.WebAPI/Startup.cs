using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RMF.DAL;
using RMF.DAL.Repos;
using RMF.DAL.Repos.Interfaces;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System;
using Lucene.Net.Store;
using RMF.WebAPI.SMTP;
using RMF.WebAPI.SearchIndex;

namespace RMF.WebAPI
{
    /// <summary>
    /// Change log:
    /// 
    /// 10/06/2022
    /// 
    /// I have noticed there have been reports from users visiting the website that it does not display the homepage and that on checking
    /// the JavaScript console there is an error "net:ERR_TOO_MANY_REDIRECTS" when requesting API methods.
    /// 
    /// I have researched this issue and it appears to be prodominently a hosting issue as the website works fine for most people. There
    /// is an easy workaround for the problem as documented here:
    /// 
    /// https://stackoverflow.com/questions/71690717/net-6-blazor-app-usehttpsredirection-is-causing-many-redirects
    /// 
    /// I have commented out the line app.UseHttpsRedirection(); in the Configure method and this has resolved the issue.
    /// 
    /// </summary>
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // CORS settings.
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder.WithOrigins("http://www.recoverymeetingfinder.com",
                                        "https://www.recoverymeetingfinder.com",
                                        "http://localhost:49890")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                });
            });

            // JSON serializer settings.
            services.AddMvc().AddNewtonsoftJson(o =>
            {
                o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                //o.SerializerSettings.Formatting = Formatting.Indented;
            });

            // Cache responses.
            services.AddResponseCaching();

            // Compress responses.
            services.AddResponseCompression();

            // Add DB Context.
            services.AddDbContext<MeetingContext>(options =>
            {
                //options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
                options.UseSqlServer(Configuration.GetConnectionString("RMF"),
                options => options.UseNetTopologySuite().EnableRetryOnFailure());
            });

            // Add DAL repositories.
            services.AddScoped<IAreaRepo, AreaRepo>();
            services.AddScoped<IRegionRepo, RegionRepo>();
            services.AddScoped<IDayRepo, DayRepo>();
            services.AddScoped<IFormatRepo, FormatRepo>();
            services.AddScoped<IMeetingFormatRepo, MeetingFormatRepo>();
            services.AddScoped<IMeetingRepo, MeetingRepo>();
            services.AddScoped<IMeetingRegionRepo, MeetingRegionRepo>();
            services.AddScoped<ITypeRepo, TypeRepo>();
            services.AddScoped<IStatisticRepo, StatisticRepo>();
            services.AddScoped<IPageIndexRepo, PageIndexRepo>();
            services.AddScoped<IDataDumpRepo, DataDumpRepo>();
            var serviceProvider = services.BuildServiceProvider();

            // Add SmtpSettings.
            var smtpSupportSettings = new SmtpSupportSettings();
            Configuration.GetSection("SMTP-Support").Bind(smtpSupportSettings);
            services.AddSingleton<SmtpSupportSettings, SmtpSupportSettings>(x => smtpSupportSettings);

            var smtpCorrectionsSettings = new SmtpCorrectionsSettings();
            Configuration.GetSection("SMTP-Corrections").Bind(smtpCorrectionsSettings);
            services.AddSingleton<SmtpCorrectionsSettings, SmtpCorrectionsSettings>(x => smtpCorrectionsSettings);

            // Build Lucene Index.
            var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            if (isDevelopment)
                new LuceneIndexWriter(serviceProvider.GetService<IPageIndexRepo>()).WriteIndex();
            
            // Read Lucene Index.
            var luceneIndex = new LuceneIndexReader().ReadIndex(isDevelopment);
            services.AddSingleton(luceneIndex);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors(MyAllowSpecificOrigins);

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseResponseCaching();

            app.UseResponseCompression();

            app.Use(async (context, next) =>
            {
                context.Response.GetTypedHeaders().CacheControl =
                    new Microsoft.Net.Http.Headers.CacheControlHeaderValue()
                    {
                        Public = true,
                        MaxAge = TimeSpan.FromSeconds(3600)
                    };
                context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.Vary] =
                    new string[] { "Accept-Encoding" };

                await next();
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
