using bdDevs.Infrastructure.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace bdDevs.Infrastructure.Identity;

public class JwtService(IConfiguration config) : IJwtService
{
	public string GenerateAccessToken(
			AppUser user,
			UserProfile profile,
			IList<string> roles,
			IList<string> permissions)
	{
		var key = new SymmetricSecurityKey(
											Encoding.UTF8.GetBytes(config["Jwt:Secret"]!));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
		var expires = DateTime.UtcNow.AddMinutes(
											int.Parse(config["Jwt:ExpiryMinutes"] ?? "15"));

		var claims = new List<Claim>
				{
						new(JwtRegisteredClaimNames.Sub,   user.Id),
						new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
						new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
						new("profileId",  profile.Id.ToString()),
						new("fullName",   $"{profile.FirstName} {profile.LastName}"),
						new("branchId",   profile.BranchId?.ToString() ?? ""),
				};

		claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
		claims.AddRange(permissions.Select(p => new Claim("permission", p)));

		var token = new JwtSecurityToken(
				issuer: config["Jwt:Issuer"],
				audience: config["Jwt:Audience"],
				claims: claims,
				expires: expires,
				signingCredentials: creds);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}

	public string GenerateRefreshToken()
	{
		var bytes = RandomNumberGenerator.GetBytes(64);
		return Convert.ToBase64String(bytes);
	}

	public bool ValidateRefreshToken(string token)
			=> !string.IsNullOrWhiteSpace(token) && token.Length >= 64;
}
