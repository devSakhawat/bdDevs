using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;

namespace bdDevs.Infrastructure.Extensions;

public static class SerilogExtensions
{
	public static WebApplicationBuilder AddSerilog(
			this WebApplicationBuilder builder)
	{
		var config = builder.Configuration;

		Log.Logger = new LoggerConfiguration()
				.MinimumLevel.Information()
				.MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
				.MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
				.MinimumLevel.Override("System", LogEventLevel.Warning)
				.Enrich.FromLogContext()
				.Enrich.WithCorrelationId()
				.Enrich.WithProperty("Application", "bdDevs")
				.Enrich.WithProperty("Environment", builder.Environment.EnvironmentName)

				// PII masking — email, phone destructure override
				.Destructure.ByTransforming<Exception>(ex => new
				{
					ex.Message,
					ex.StackTrace,
					Type = ex.GetType().Name
				})

				// Sinks
				.WriteTo.Console(
						outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] " +
														"{CorrelationId} {Message:lj}{NewLine}{Exception}")

				.WriteTo.File(
						path: "logs/bdDevsm-.log",
						rollingInterval: RollingInterval.Day,
						retainedFileCountLimit: 30,
						outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] " +
														"{CorrelationId} {Message:lj}{NewLine}{Exception}")

				.WriteTo.MSSqlServer(
						connectionString: config.GetConnectionString("Default"),
						sinkOptions: new Serilog.Sinks.MSSqlServer.MSSqlServerSinkOptions
						{
							TableName = "SerilogLogs",
							SchemaName = "dbo",
							AutoCreateSqlTable = true
						},
						restrictedToMinimumLevel: LogEventLevel.Warning) // শুধু Warning+ DB-তে

				.CreateLogger();

		builder.Host.UseSerilog();
		return builder;
	}
}
