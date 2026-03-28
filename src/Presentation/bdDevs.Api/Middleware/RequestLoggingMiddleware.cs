using System.Diagnostics;

namespace bdDevs.Api.Middleware;

public class RequestLoggingMiddleware(
		RequestDelegate next,
		ILogger<RequestLoggingMiddleware> logger)
{
	public async Task InvokeAsync(HttpContext context)
	{
		var correlationId = context.Items["CorrelationId"]?.ToString() ?? "-";
		var method = context.Request.Method;
		var path = context.Request.Path;
		var sw = Stopwatch.StartNew();

		logger.LogInformation(
				"[REQ] {CorrelationId} {Method} {Path}",
				correlationId, method, path);

		await next(context);

		sw.Stop();
		var statusCode = context.Response.StatusCode;

		var level = statusCode >= 500 ? LogLevel.Error
							: statusCode >= 400 ? LogLevel.Warning
							: LogLevel.Information;

		logger.Log(level,
				"[RES] {CorrelationId} {Method} {Path} → {StatusCode} ({ElapsedMs}ms)",
				correlationId, method, path, statusCode, sw.ElapsedMilliseconds);
	}
}