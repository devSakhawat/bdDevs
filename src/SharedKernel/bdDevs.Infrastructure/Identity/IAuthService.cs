namespace bdDevs.Infrastructure.Identity;

public interface IAuthService
{
	Task<AuthResult> LoginAsync(string username, string password, string ipAddress);
	Task<AuthResult> RefreshAsync(string refreshToken, string ipAddress);
	Task RevokeAsync(string refreshToken);
}

public record AuthResult(
		bool Success,
		string? AccessToken,
		string? RefreshToken,
		DateTime? AccessTokenExpiry,
		string? Error = null);