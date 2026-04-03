//using bdDevs.Application.Common.Interfaces;
//using bdDevs.Contracts.Responses;
//using bdDevs.Infrastructure.Data;
//using bdDevs.Infrastructure.Services;
//using Microsoft.EntityFrameworkCore;
//using System.Text.Json;


//namespace bdDevs.Infrastructure.Services;
///// <summary>
///// Reads/writes user UI preferences from UserProfiles.SettingsJson.
///// Redis cache layer (60-min TTL) prevents DB reads on every page load.
///// </summary>
//public class UserPreferenceService : IUserPreferenceService
//{
//	private readonly AppDbContext _db;
//	private readonly ICacheService _cache;

//	private static readonly JsonSerializerOptions _json = new()
//	{
//		PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
//		PropertyNameCaseInsensitive = true,
//		WriteIndented = false,
//	};

//	public UserPreferenceService(AppDbContext db, ICacheService cache)
//	{
//		_db = db;
//		_cache = cache;
//	}

//	// ── GET ─────────────────────────────────────────────────
//	public async Task<UserPreferencesDto> GetAsync(string userId, CancellationToken ct = default)
//	{
//		var cacheKey = $"user:prefs:{userId}";

//		// 1. Try Redis cache first
//		var cached = await _cache.GetAsync<UserPreferencesDto>(cacheKey, ct);
//		if (cached is not null) return cached;

//		// 2. Read SettingsJson from DB
//		var settingsJson = await _db.UserProfiles
//				.AsNoTracking()
//				.Where(p => p.AspNetUserId == userId)
//				.Select(p => p.SettingsJson)
//				.FirstOrDefaultAsync(ct);

//		var prefs = _deserialize(settingsJson);

//		// 3. Cache for 60 minutes
//		await _cache.SetAsync(cacheKey, prefs, TimeSpan.FromMinutes(60), ct);

//		return prefs;
//	}

//	// ── SAVE FULL ────────────────────────────────────────────
//	public async Task SaveAsync(
//			string userId, UserPreferencesDto prefs, CancellationToken ct = default)
//	{
//		var json = JsonSerializer.Serialize(prefs, _json);
//		await _updateColumn(userId, json, ct);
//		await _cache.RemoveAsync($"user:prefs:{userId}", ct);
//	}

//	// ── SAVE THEME ONLY ──────────────────────────────────────
//	public async Task SaveThemeAsync( string userId, ThemePreference theme, CancellationToken ct = default)
//	{
//		// Merge into existing prefs so other fields (gridDefaults, sidebarCollapsed) are kept
//		var existing = await GetAsync(userId, ct);
//		existing.ThemeFamily = theme.ThemeFamily;
//		existing.ThemeMode = theme.ThemeMode;
//		existing.Density = theme.Density;
//		await SaveAsync(userId, existing, ct);
//	}

//	// ── HELPERS ─────────────────────────────────────────────
//	private async Task _updateColumn( string userId, string json, CancellationToken ct)
//	{
//		var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.AspNetUserId == userId, ct);

//		if (profile is null) return;

//		profile.SettingsJson = json;
//		await _db.SaveChangesAsync(ct);
//	}

//	private static UserPreferencesDto _deserialize(string? json)
//	{
//		if (string.IsNullOrWhiteSpace(json)) return new UserPreferencesDto();
//		try { return JsonSerializer.Deserialize<UserPreferencesDto>(json, _json) ?? new(); }
//		catch { return new UserPreferencesDto(); }
//	}
//}
