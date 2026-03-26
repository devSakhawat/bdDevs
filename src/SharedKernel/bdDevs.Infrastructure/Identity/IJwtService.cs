using bdDevs.Infrastructure.Entities;

namespace bdDevs.Infrastructure.Identity;

public interface IJwtService
{
	string GenerateAccessToken(AppUser user, UserProfile profile,
														 IList<string> roles, IList<string> permissions);
	string GenerateRefreshToken();
	bool ValidateRefreshToken(string token);
}
