using bdDevs.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace bdDevs.Application.Common.Behaviors;

// Queries implement this to opt-in to caching
public interface ICacheable
{
	string CacheKey { get; }
	TimeSpan? CacheExpiry => null; // null = default (5 min)
}

public sealed class CachingBehavior<TRequest, TResponse>(
		ICacheService cache,
		ILogger<CachingBehavior<TRequest, TResponse>> logger)
		: IPipelineBehavior<TRequest, TResponse>
		where TRequest : notnull
{
	private static readonly TimeSpan DefaultExpiry = TimeSpan.FromMinutes(5);

	public async Task<TResponse> Handle(
			TRequest request,
			RequestHandlerDelegate<TResponse> next,
			CancellationToken cancellationToken)
	{
		// Only cache if request implements ICacheable
		if (request is not ICacheable cacheable)
			return await next();

		var key = cacheable.CacheKey;
		var expiry = cacheable.CacheExpiry ?? DefaultExpiry;

		var cached = await cache.GetAsync<TResponse>(key, cancellationToken);
		if (cached is not null)
		{
			logger.LogDebug("[CACHE HIT] {Key}", key);
			return cached;
		}

		logger.LogDebug("[CACHE MISS] {Key}", key);
		var response = await next();

		await cache.SetAsync(key, response, expiry, cancellationToken);
		return response;
	}
}