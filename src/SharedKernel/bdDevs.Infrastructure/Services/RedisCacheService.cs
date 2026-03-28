using bdDevs.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace bdDevs.Infrastructure.Services;

public class RedisCacheService(
		IDistributedCache cache,
		ILogger<RedisCacheService> logger) : ICacheService
{
	private static readonly JsonSerializerOptions JsonOpts = new()
	{
		PropertyNamingPolicy = JsonNamingPolicy.CamelCase
	};

	public async Task<T?> GetAsync<T>(string key, CancellationToken ct = default)
	{
		try
		{
			var data = await cache.GetStringAsync(key, ct);
			return data is null
					? default
					: JsonSerializer.Deserialize<T>(data, JsonOpts);
		}
		catch (Exception ex)
		{
			logger.LogWarning(ex, "[CACHE] Get failed for key: {Key}", key);
			return default; // Cache failure = silent degradation
		}
	}

	public async Task SetAsync<T>(
			string key, T value,
			TimeSpan? expiry = null,
			CancellationToken ct = default)
	{
		try
		{
			var opts = new DistributedCacheEntryOptions
			{
				AbsoluteExpirationRelativeToNow = expiry ?? TimeSpan.FromMinutes(5)
			};
			var json = JsonSerializer.Serialize(value, JsonOpts);
			await cache.SetStringAsync(key, json, opts, ct);
		}
		catch (Exception ex)
		{
			logger.LogWarning(ex, "[CACHE] Set failed for key: {Key}", key);
		}
	}

	public async Task RemoveAsync(string key, CancellationToken ct = default)
	{
		try { await cache.RemoveAsync(key, ct); }
		catch (Exception ex)
		{
			logger.LogWarning(ex, "[CACHE] Remove failed for key: {Key}", key);
		}
	}

	public async Task RemoveByPrefixAsync(string prefix, CancellationToken ct = default)
	{
		// DistributedCache-এ prefix delete directly supported নয়
		// StackExchange.Redis ConnectionMultiplexer দিয়ে করতে হয়
		// এটা Phase 2-এ implement হবে — এখন log করো
		logger.LogDebug("[CACHE] RemoveByPrefix called: {Prefix} (not yet implemented)", prefix);
		await Task.CompletedTask;
	}
}
