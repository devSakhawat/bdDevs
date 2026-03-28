//using bdDevs.Contracts.Responses;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace bdDevs.Api.Controllers;

///// <summary>
///// Handles user theme + UI preference persistence.
///// Step 7.3 — Theme Platform
///// </summary>
//[ApiController]
//[Route("api/user")]
//[Authorize]
//public class ThemeController : BaseApiController
//{
//	private readonly IUserPreferenceService _preferenceService;
//	private readonly ILogger<ThemeController> _logger;

//	public ThemeController(
//			IUserPreferenceService preferenceService,
//			ILogger<ThemeController> logger)
//	{
//		_preferenceService = preferenceService;
//		_logger = logger;
//	}

//	// ──────────────────────────────────────────────────────
//	//  GET /api/user/preferences
//	// ──────────────────────────────────────────────────────
//	/// <summary>
//	/// Get current user's UI preferences (theme, density, grid defaults).
//	/// </summary>
//	[HttpGet("preferences")]
//	[ProducesResponseType(typeof(StandardApiResponse<UserPreferencesDto>), 200)]
//	public async Task<IActionResult> GetPreferences(CancellationToken ct)
//	{
//		var userId = GetCurrentUserId();
//		var prefs = await _preferenceService.GetAsync(userId, ct);
//		return OkResponse(prefs, GetCorrelationId());
//	}

//	// ──────────────────────────────────────────────────────
//	//  PUT /api/user/theme
//	// ──────────────────────────────────────────────────────
//	/// <summary>
//	/// Save user's theme preference (family, mode, density).
//	/// Called by theme-switcher.js after every theme change (debounced 800ms).
//	/// </summary>
//	[HttpPut("theme")]
//	[ProducesResponseType(typeof(StandardApiResponse<object>), 200)]
//	[ProducesResponseType(typeof(StandardApiResponse<object>), 400)]
//	public async Task<IActionResult> SaveTheme(
//			[FromBody] SaveThemeRequest request,
//			CancellationToken ct)
//	{
//		if (!ModelState.IsValid)
//			return BadRequestResponse("Invalid theme settings.");

//		var userId = GetCurrentUserId();

//		await _preferenceService.SaveThemeAsync(userId, new ThemePreference
//		{
//			ThemeFamily = request.ThemeFamily,
//			ThemeMode = request.ThemeMode,
//			Density = request.Density,
//		}, ct);

//		_logger.LogInformation(
//				"User {UserId} changed theme to {Family}/{Mode}/{Density}",
//				userId, request.ThemeFamily, request.ThemeMode, request.Density);

//		return OkResponse<object>(null, GetCorrelationId());
//	}

//	// ──────────────────────────────────────────────────────
//	//  PUT /api/user/preferences
//	// ──────────────────────────────────────────────────────
//	/// <summary>
//	/// Save full user preferences (theme + grid + sidebar state).
//	/// </summary>
//	[HttpPut("preferences")]
//	[ProducesResponseType(typeof(StandardApiResponse<object>), 200)]
//	public async Task<IActionResult> SavePreferences(
//			[FromBody] UserPreferencesDto request,
//			CancellationToken ct)
//	{
//		var userId = GetCurrentUserId();
//		await _preferenceService.SaveAsync(userId, request, ct);
//		return OkResponse<object>(null, GetCorrelationId());
//	}
//}

//// ──────────────────────────────────────────────────────────
////  DTOs
//// ──────────────────────────────────────────────────────────

///// <summary>
///// Request body for PUT /api/user/theme
///// </summary>
//public class SaveThemeRequest
//{
//	/// <summary>Kendo theme family: default | bootstrap | material | fluent</summary>
//	public string ThemeFamily { get; set; } = "default";

//	/// <summary>Color mode: light | dark</summary>
//	public string ThemeMode { get; set; } = "light";

//	/// <summary>Layout density: comfortable | compact</summary>
//	public string Density { get; set; } = "comfortable";
//}

///// <summary>
///// Full user preferences — persisted as JSON in UserProfiles.SettingsJson
///// </summary>
//public class UserPreferencesDto
//{
//	public string ThemeFamily { get; set; } = "default";
//	public string ThemeMode { get; set; } = "light";
//	public string Density { get; set; } = "comfortable";
//	public bool SidebarCollapsed { get; set; } = false;
//	public GridDefaults GridDefaults { get; set; } = new();
//}

//public class GridDefaults
//{
//	public int PageSize { get; set; } = 20;
//}

//public class ThemePreference
//{
//	public string ThemeFamily { get; set; } = "default";
//	public string ThemeMode { get; set; } = "light";
//	public string Density { get; set; } = "comfortable";
//}