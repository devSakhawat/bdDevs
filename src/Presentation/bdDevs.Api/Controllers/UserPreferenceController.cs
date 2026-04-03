//using bdDevs.Infrastructure.Data;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims;
//using System.Text.Json;

//namespace bdDevs.Api.Controllers;

//[Authorize]
//[ApiController]
//[Route("api/user/preference")]
//public class UserPreferenceController(AppDbContext db) : BaseApiController
//{
//	[HttpPut("theme")]
//	public async Task<IActionResult> SaveTheme(
//			[FromBody] SaveThemeRequest req)
//	{
//		var profileId = User.FindFirstValue("profileId");
//		if (!long.TryParse(profileId, out var id))
//			return ValidationFail("profileId", "Invalid profile.");

//		var profile = await db.UserProfiles.FindAsync(id);
//		if (profile is null)
//			return NotFoundResponse("UserProfile", id);

//		// Merge into existing SettingsJson
//		var settings = string.IsNullOrEmpty(profile.SettingsJson)
//				? new Dictionary<string, object>()
//				: JsonSerializer.Deserialize<Dictionary<string, object>>(
//						profile.SettingsJson) ?? new();

//		settings["themeFamily"] = req.ThemeFamily;
//		settings["themeMode"] = req.ThemeMode;
//		settings["density"] = req.Density;
//		settings["sidebarCollapsed"] = req.SidebarCollapsed;
//		settings["gridDefaults"] = req.GridDefaults
//																	 ?? new { pageSize = 20 };

//		profile.SettingsJson = JsonSerializer.Serialize(settings);
//		profile.ModifiedAt = DateTime.UtcNow;

//		await db.SaveChangesAsync();

//		// Update cookie via response header instruction
//		// (actual cookie set by client-side themeService)
//		return OkResponse(new { saved = true });
//	}

//	[HttpGet("theme")]
//	public async Task<IActionResult> GetTheme()
//	{
//		var profileId = User.FindFirstValue("profileId");
//		if (!long.TryParse(profileId, out var id))
//			return ValidationFail("profileId", "Invalid profile.");

//		var profile = await db.UserProfiles.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

//		if (profile is null)
//			return NotFoundResponse("UserProfile", id);

//		if (string.IsNullOrEmpty(profile.SettingsJson))
//			return OkResponse(new
//			{
//				themeFamily = "bootstrap",
//				themeMode = "light",
//				density = "comfortable",
//				sidebarCollapsed = false,
//				gridDefaults = new { pageSize = 20 }
//			});

//		var settings = JsonSerializer.Deserialize<object>(
//				profile.SettingsJson);

//		return OkResponse(settings);
//	}
//}

//public record SaveThemeRequest(
//		string ThemeFamily,
//		string ThemeMode,
//		string Density,
//		bool SidebarCollapsed,
//		object? GridDefaults = null);