using bdDevs.Contracts.Responses;

namespace bdDevs.Infrastructure.Services;

public interface IUserPreferenceService
{
	Task<UserPreferencesDto> GetAsync(string userId, CancellationToken ct = default);
	Task SaveAsync(string userId, UserPreferencesDto prefs, CancellationToken ct = default);
	Task SaveThemeAsync(string userId, ThemePreference theme, CancellationToken ct = default);
}

