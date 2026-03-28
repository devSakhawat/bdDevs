using System;
using System.Collections.Generic;
using System.Text;

namespace bdDevs.Contracts.Responses;

/// <summary>
/// User UI preferences — persisted as JSON in UserProfiles.SettingsJson
/// Shared across API, Infrastructure, and Web layers via bdDevs.Contracts
/// </summary>
public class UserPreferencesDto
{
	public string ThemeFamily { get; set; } = "default";
	public string ThemeMode { get; set; } = "light";
	public string Density { get; set; } = "comfortable";
	public bool SidebarCollapsed { get; set; } = false;
	public GridDefaultsDto GridDefaults { get; set; } = new();
}

public class GridDefaultsDto
{
	public int PageSize { get; set; } = 20;
}

public class ThemePreference
{
	public string ThemeFamily { get; set; } = "default";
	public string ThemeMode { get; set; } = "light";
	public string Density { get; set; } = "comfortable";
}