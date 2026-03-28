//using bdDevs.Application.Common.Interfaces;
//using bdDevs.Contracts.Responses;
//using bdDevs.Infrastructure.Data;
//using System;
//using System.Collections.Generic;
//using System.Text;
//using System.Text.Json;

//namespace bdDevs.Infrastructure.Services;

///// <summary>
///// Persists user UI preferences to UserProfiles.SettingsJson column.
///// Uses Redis cache for fast reads (invalidated on write).
///// </summary>
//public class UserPreferenceService : IUserPreferenceService
//{
//	private readonly AppDbContext _db;
//	private readonly ICacheService _cache;
//	private static readonly JsonSerializerOptions _jsonOpts = new()
//	{
//		PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
//		PropertyNameCaseInsensitive = true,
//	};

//	public UserPreferenceService(AppDbContext db, ICacheService cache)
//	{
//		_db = db;
//		_cache = cache;
//	}

//	// ── GET ─────────────────────────────────────────────────
//	public async Task<UserPreferencesDto> GetAsync(string userId, CancellationToken ct = default)
//	{
//		var cacheKey = CacheKey(userId);

//		// Try cache first
//		var cached = await _cache.GetAsync<UserPreferencesDto>(cacheKey, ct);
//		if (cached is not null) return cached;

//		// Read from DB
//		var profile = await _db.UserProfiles
//				.AsNoTracking()
//				.Where(p => p.UserId == userId)
//				.Select(p => p.SettingsJson)
//				.FirstOrDefaultAsync(ct);

//		var prefs = Deserialize(profile);

//		// Cache for 60 minutes
//		await _cache.SetAsync(cacheKey, prefs, TimeSpan.FromMinutes(60), ct);

//		return prefs;
//	}

//	// ── SAVE FULL PREFS ─────────────────────────────────────
//	public async Task SaveAsync(string userId, UserPreferencesDto prefs, CancellationToken ct = default)
//	{
//		var json = JsonSerializer.Serialize(prefs, _jsonOpts);
//		await _updateSettingsJson(userId, json, ct);
//		await _cache.RemoveAsync(CacheKey(userId), ct);
//	}

//	// ── SAVE THEME ONLY ─────────────────────────────────────
//	public async Task SaveThemeAsync(string userId, ThemePreference theme, CancellationToken ct = default)
//	{
//		// Read existing, merge, save — so other preferences aren't lost
//		var existing = await GetAsync(userId, ct);
//		existing.ThemeFamily = theme.ThemeFamily;
//		existing.ThemeMode = theme.ThemeMode;
//		existing.Density = theme.Density;
//		await SaveAsync(userId, existing, ct);
//	}

//	// ── HELPERS ─────────────────────────────────────────────
//	private async Task _updateSettingsJson(string userId, string json, CancellationToken ct)
//	{
//		var profile = await _db.UserProfiles.Where(p => p.UserId == userId).FirstOrDefaultAsync(ct);

//		if (profile is null) return;

//		profile.SettingsJson = json;
//		await _db.SaveChangesAsync(ct);
//	}

//	private static UserPreferencesDto Deserialize(string? json)
//	{
//		if (string.IsNullOrWhiteSpace(json))
//			return new UserPreferencesDto();

//		try
//		{
//			return JsonSerializer.Deserialize<UserPreferencesDto>(json, _jsonOpts)
//						 ?? new UserPreferencesDto();
//		}
//		catch
//		{
//			return new UserPreferencesDto();
//		}
//	}

//	private static string CacheKey(string userId) => $"user:prefs:{userId}";
