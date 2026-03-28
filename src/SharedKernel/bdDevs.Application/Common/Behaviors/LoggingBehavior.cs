using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace bdDevs.Application.Common.Behaviors;

public sealed class LoggingBehavior<TRequest, TResponse>(
		ILogger<LoggingBehavior<TRequest, TResponse>> logger) : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
	public async Task<TResponse> Handle(
			TRequest request,
			RequestHandlerDelegate<TResponse> next,
			CancellationToken cancellationToken)
	{
		var requestName = typeof(TRequest).Name;
		var sw = Stopwatch.StartNew();

		logger.LogInformation(
				"[START] {RequestName} {@Request}",
				requestName, request);

		try
		{
			var response = await next();
			sw.Stop();

			logger.LogInformation(
					"[END] {RequestName} — {ElapsedMs}ms",
					requestName, sw.ElapsedMilliseconds);

			if (sw.ElapsedMilliseconds > 500)
				logger.LogWarning(
						"[SLOW] {RequestName} took {ElapsedMs}ms — consider optimization",
						requestName, sw.ElapsedMilliseconds);

			return response;
		}
		catch (Exception ex)
		{
			sw.Stop();
			logger.LogError(ex,
					"[ERROR] {RequestName} failed after {ElapsedMs}ms",
					requestName, sw.ElapsedMilliseconds);
			throw;
		}
	}
}
