using bdDevs.Infrastructure.Data;
using bdDevs.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace bdDevs.Infrastructure.Identity;

public class AuthService(
		UserManager<AppUser> userManager,
		AppDbContext db,
		IJwtService jwt) : IAuthService
{
	public async Task<AuthResult> LoginAsync(
			string username, string password, string ipAddress)
	{
		// 1. Find user
		var user = await userManager.FindByNameAsync(username)
						?? await userManager.FindByEmailAsync(username);

		if (user is null)
			return new AuthResult(false, null, null, null, "Invalid credentials");

		// 2. Verify password (BCrypt OR legacy)
		var valid = await userManager.CheckPasswordAsync(user, password);
		if (!valid)
			return new AuthResult(false, null, null, null, "Invalid credentials");

		// 3. Load profile + roles + permissions
		var profile = await db.UserProfiles
				.FirstOrDefaultAsync(p => p.AspNetUserId == user.Id);

		if (profile is null || profile.Status != 1)
			return new AuthResult(false, null, null, null, "Account inactive");

		var roles = await userManager.GetRolesAsync(user);

		var permissions = await db.RolePermissions
				.Where(rp => rp.IsGranted &&
							 db.UserRoles
								 .Where(ur => ur.UserProfileId == profile.Id)
								 .Select(ur => ur.RoleId)
								 .Contains(rp.RoleId))
				.Include(rp => rp.Permission)
				.Select(rp => $"{rp.Permission!.Module}.{rp.Permission.Resource}.{rp.Permission.Action}")
				.Distinct()
				.ToListAsync();

		// 4. Generate tokens
		var accessToken = jwt.GenerateAccessToken(user, profile, roles, permissions);
		var refreshToken = jwt.GenerateRefreshToken();
		var accessExpiry = DateTime.UtcNow.AddMinutes(15);

		// 5. Save refresh token
		db.RefreshTokens.Add(new RefreshToken
		{
			UserId = user.Id,
			Token = refreshToken,
			ExpiresAt = DateTime.UtcNow.AddDays(7),
			CreatedByIp = ipAddress
		});

		// 6. Update last login
		profile.LastLoginAt = DateTime.UtcNow;
		await db.SaveChangesAsync();

		return new AuthResult(true, accessToken, refreshToken, accessExpiry);
	}

	public async Task<AuthResult> RefreshAsync(string refreshToken, string ipAddress)
	{
		var stored = await db.RefreshTokens
				.FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked);

		if (stored is null || stored.ExpiresAt < DateTime.UtcNow)
			return new AuthResult(false, null, null, null, "Invalid or expired refresh token");

		var user = await userManager.FindByIdAsync(stored.UserId);
		if (user is null)
			return new AuthResult(false, null, null, null, "User not found");

		var profile = await db.UserProfiles.FirstAsync(p => p.AspNetUserId == user.Id);
		var roles = await userManager.GetRolesAsync(user);
		var permissions = await db.RolePermissions
				.Where(rp => rp.IsGranted &&
							 db.UserRoles.Where(ur => ur.UserProfileId == profile.Id)
													 .Select(ur => ur.RoleId).Contains(rp.RoleId))
				.Include(rp => rp.Permission)
				.Select(rp => $"{rp.Permission!.Module}.{rp.Permission.Resource}.{rp.Permission.Action}")
				.Distinct().ToListAsync();

		// Rotate refresh token
		var newRefreshToken = jwt.GenerateRefreshToken();
		stored.IsRevoked = true;
		stored.RevokedAt = DateTime.UtcNow;
		stored.ReplacedBy = newRefreshToken;

		db.RefreshTokens.Add(new RefreshToken
		{
			UserId = user.Id,
			Token = newRefreshToken,
			ExpiresAt = DateTime.UtcNow.AddDays(7),
			CreatedByIp = ipAddress
		});

		await db.SaveChangesAsync();

		var accessToken = jwt.GenerateAccessToken(user, profile, roles, permissions);
		var accessExpiry = DateTime.UtcNow.AddMinutes(15);

		return new AuthResult(true, accessToken, newRefreshToken, accessExpiry);
	}

	public async Task RevokeAsync(string refreshToken)
	{
		var stored = await db.RefreshTokens
				.FirstOrDefaultAsync(t => t.Token == refreshToken);

		if (stored is null) return;
		stored.IsRevoked = true;
		stored.RevokedAt = DateTime.UtcNow;
		await db.SaveChangesAsync();
	}
}
