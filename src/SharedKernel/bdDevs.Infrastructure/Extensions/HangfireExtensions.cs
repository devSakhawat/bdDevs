using bdDevs.Infrastructure.Hangfire;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace bdDevs.Infrastructure.Extensions;

public static class HangfireExtensions
{
	public static IServiceCollection AddHangfireServices(
			this IServiceCollection services,
			IConfiguration config)
	{
		services.AddHangfire(cfg => cfg
				.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
				.UseSimpleAssemblyNameTypeSerializer()
				.UseRecommendedSerializerSettings()
				.UseSqlServerStorage(
						config.GetConnectionString("Default"),
						new SqlServerStorageOptions
						{
							CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
							SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
							QueuePollInterval = TimeSpan.FromSeconds(15),
							UseRecommendedIsolationLevel = true,
							DisableGlobalLocks = true,
							SchemaName = "hangfire"
						}));

		services.AddHangfireServer(opt =>
		{
			opt.WorkerCount = 5;            // solo developer machine, adjust for production
			opt.Queues = ["critical", "default", "low"];
			opt.ServerName = "bdDevs-Worker";
		});

		return services;
	}

	public static IApplicationBuilder UseHangfireDashboardSecured(
			this IApplicationBuilder app)
	{
		app.UseHangfireDashboard("/hangfire", new DashboardOptions
		{
			DashboardTitle = "bdDevs Jobs",
			IsReadOnlyFunc = _ => false,
			Authorization = [new HangfireAuthFilter()]
		});

		return app;
	}
}
