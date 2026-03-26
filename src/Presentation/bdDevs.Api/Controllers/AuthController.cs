using bdDevs.Contracts.Responses;
using bdDevs.Infrastructure.Identity;
using Microsoft.AspNetCore.Mvc;

namespace bdDevs.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
	[HttpPost("login")]
	public async Task<IActionResult> Login([FromBody] LoginRequest req)
	{
		var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
		var result = await authService.LoginAsync(req.Username, req.Password, ip);

		if (!result.Success)
			return Unauthorized(StandardApiResponse<string>
					.Fail("credentials", result.Error ?? "Login failed"));

		Response.Cookies.Append("refreshToken", result.RefreshToken!, new CookieOptions
		{
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.Strict,
			Expires = DateTimeOffset.UtcNow.AddDays(7)
		});

		return Ok(StandardApiResponse<LoginResponse>.Ok(new LoginResponse(
				result.AccessToken!,
				result.AccessTokenExpiry!.Value)));
	}

	[HttpPost("refresh")]
	public async Task<IActionResult> Refresh()
	{
		var refreshToken = Request.Cookies["refreshToken"];
		if (string.IsNullOrEmpty(refreshToken))
			return Unauthorized();

		var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
		var result = await authService.RefreshAsync(refreshToken, ip);

		if (!result.Success)
			return Unauthorized(StandardApiResponse<string>
					.Fail("token", result.Error ?? "Invalid token"));

		Response.Cookies.Append("refreshToken", result.RefreshToken!, new CookieOptions
		{
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.Strict,
			Expires = DateTimeOffset.UtcNow.AddDays(7)
		});

		return Ok(StandardApiResponse<LoginResponse>.Ok(new LoginResponse(
				result.AccessToken!,
				result.AccessTokenExpiry!.Value)));
	}

	[HttpPost("logout")]
	public async Task<IActionResult> Logout()
	{
		var refreshToken = Request.Cookies["refreshToken"];
		if (!string.IsNullOrEmpty(refreshToken))
			await authService.RevokeAsync(refreshToken);

		Response.Cookies.Delete("refreshToken");
		return Ok();
	}
}

public record LoginRequest(string Username, string Password);
public record LoginResponse(string AccessToken, DateTime ExpiresAt);