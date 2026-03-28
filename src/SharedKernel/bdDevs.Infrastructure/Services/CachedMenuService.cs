using bdDevs.Application.Common.Interfaces;
using bdDevs.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Text;

namespace bdDevs.Infrastructure.Services;

public class CachedMenuService(
		MenuService inner,
		ICacheService cache) : IMenuService
{
	private static string CacheKey(long userId) => $"menu:{userId}";
	private static readonly TimeSpan Expiry = TimeSpan.FromMinutes(30);

	public async Task<List<MenuItemDto>> GetMenuForUserAsync(long userProfileId)
	{
		var key = CacheKey(userProfileId);
		var cached = await cache.GetAsync<List<MenuItemDto>>(key);
		if (cached is not null) return cached;

		var menu = await inner.GetMenuForUserAsync(userProfileId);
		await cache.SetAsync(key, menu, Expiry);
		return menu;
	}

	// Menu cache invalidate করো যখন role/permission change হয়
	public async Task InvalidateAsync(long userProfileId)
	{
		await cache.RemoveAsync(CacheKey(userProfileId));
	}
}
