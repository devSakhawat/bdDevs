// ════════════════════════════════════════════════════════════════════
//  Step 7.3 — DB Change: Add SettingsJson to UserProfiles
// ════════════════════════════════════════════════════════════════════
//
//  UserProfiles table-এ SettingsJson column নেই থাকলে এই SQL run করো:
//
//  ALTER TABLE dbo.UserProfiles
//  ADD SettingsJson NVARCHAR(MAX) NULL;
//
//  EF Core entity-তে এই property যোগ করো:
// ════════════════════════════════════════════════════════════════════

// ── UserProfile.cs (existing entity — শুধু SettingsJson add করো) ──
//
// namespace bdDevCRM.Infrastructure.Identity;
//
// public class UserProfile          // existing class
// {
//     public int    Id         { get; set; }
//     public string UserId     { get; set; } = "";
//     public AppUser User      { get; set; } = null!;
//
//     // ── ADD THIS ──
//     public string? SettingsJson { get; set; }
//
//     // ... existing properties (BranchId, etc.)
// }


// ════════════════════════════════════════════════════════════════════
//  InfrastructureServiceExtensions.cs
//  — register IUserPreferenceService
//  Add inside AddInfrastructure() method:
// ════════════════════════════════════════════════════════════════════
//
//  services.AddScoped<IUserPreferenceService, UserPreferenceService>();


// ════════════════════════════════════════════════════════════════════
//  _Layout.cshtml — No-Flicker Cookie Read
//  Add this at the very top of <html> tag, BEFORE any CSS loads.
//  Reads the bdTheme cookie set by theme-service.ts and applies
//  data-attributes server-side so there is zero flash on page load.
// ════════════════════════════════════════════════════════════════════

/*
@{
    // Read theme cookie written by theme-service.ts
    // Format: "family:mode:density"  e.g. "bootstrap:dark:compact"
    var themeCookie = Context.Request.Cookies["bdTheme"] ?? "";
    var themeParts  = themeCookie.Split(':');
    var themeFamily = themeParts.ElementAtOrDefault(0) ?? ViewData["ThemeFamily"]?.ToString() ?? "default";
    var themeMode   = themeParts.ElementAtOrDefault(1) ?? ViewData["ThemeMode"]?.ToString()   ?? "light";
    var themeDensity= themeParts.ElementAtOrDefault(2) ?? ViewData["Density"]?.ToString()     ?? "comfortable";

    // Sanitize (prevent XSS)
    var validFamilies  = new[] { "default","bootstrap","material","fluent" };
    var validModes     = new[] { "light","dark" };
    var validDensities = new[] { "comfortable","compact" };
    if (!validFamilies.Contains(themeFamily))   themeFamily  = "default";
    if (!validModes.Contains(themeMode))         themeMode    = "light";
    if (!validDensities.Contains(themeDensity))  themeDensity = "comfortable";
}

<html lang="en"
      data-theme-family="@themeFamily"
      data-theme-mode="@themeMode"
      data-density="@themeDensity">
*/

// ════════════════════════════════════════════════════════════════════
//  bundle.ts — expose ThemeService to window
//  Add/update these lines in your existing bundle.ts:
// ════════════════════════════════════════════════════════════════════

/*
import { ThemeService }  from './services/theme-service';
import { BdApiService }  from './core/api-service';

// ThemeService needs api for DB persist
const _api   = new BdApiService();
const _theme = new ThemeService(_api);

// Apply theme IMMEDIATELY (before DOM is ready) — prevents flicker
_theme.applyImmediate();

// After DOM ready — init picker UI
document.addEventListener('DOMContentLoaded', () => {
    _theme.initPicker();
});

// Expose to window
(window as any).bdTheme = _theme;
*/
