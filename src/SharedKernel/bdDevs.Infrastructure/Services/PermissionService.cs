using bdDevs.Application.Common.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace bdDevs.Infrastructure.Services;

public class PermissionService(
		IConfiguration config,
		ICacheService cache,
		ILogger<PermissionService> logger) : IPermissionService
{
	private readonly string _conn = config.GetConnectionString("Default")!;
	private static string CacheKey(long id) => $"perms:{id}";
	private static readonly TimeSpan Expiry = TimeSpan.FromMinutes(15);

	public async Task<IReadOnlyList<string>> GetPermissionsAsync(long userProfileId)
	{
		var key = CacheKey(userProfileId);
		var cached = await cache.GetAsync<List<string>>(key);
		if (cached is not null) return cached;

		const string sql = """
            SELECT DISTINCT
                p.Module + '.' + p.Resource + '.' + p.Action
            FROM   dbo.UserRoles       ur
            JOIN   dbo.RolePermissions rp ON rp.RoleId       = ur.RoleId
            JOIN   dbo.Permissions     p  ON p.Id            = rp.PermissionId
            WHERE  ur.UserProfileId = @UserProfileId
            AND    rp.IsGranted     = 1;
            """;

		var perms = new List<string>();

		try
		{
			await using var cn = new SqlConnection(_conn);
			await using var cmd = new SqlCommand(sql, cn);
			cmd.Parameters.AddWithValue("@UserProfileId", userProfileId);

			await cn.OpenAsync();
			await using var reader = await cmd.ExecuteReaderAsync();
			while (await reader.ReadAsync())
				perms.Add(reader.GetString(0));
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "[PERMS] Failed to load permissions for {UserId}", userProfileId);
		}

		await cache.SetAsync(key, perms, Expiry);
		return perms;
	}

	public async Task InvalidateCacheAsync(long userProfileId)
	{
		await cache.RemoveAsync(CacheKey(userProfileId));
	}
}
