using bdDevs.Contracts.Responses;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace bdDevs.Infrastructure.Services;

public interface IMenuService
{
	Task<List<MenuItemDto>> GetMenuForUserAsync(long userProfileId);
}

public class MenuService(
		IConfiguration config,
		ILogger<MenuService> logger) : IMenuService
{
	private readonly string _conn =
			config.GetConnectionString("Default")!;

	public async Task<List<MenuItemDto>> GetMenuForUserAsync(long userProfileId)
	{
		const string sql = """
            WITH UserPermissions AS (
                SELECT DISTINCT p.Id AS PermissionId
                FROM   dbo.UserRoles        ur
                JOIN   dbo.RolePermissions  rp ON rp.RoleId       = ur.RoleId
                JOIN   dbo.Permissions      p  ON p.Id            = rp.PermissionId
                WHERE  ur.UserProfileId = @UserProfileId
                AND    rp.IsGranted     = 1
            )
            SELECT
                m.Id,
                m.ParentId,
                m.Title,
                m.Icon,
                m.Url,
                m.SortOrder
            FROM dbo.Menus m
            WHERE m.IsActive = 1
            AND (
                m.PermissionId IS NULL          -- group headers — always include
                OR m.PermissionId IN (
                    SELECT PermissionId FROM UserPermissions
                )
            )
            ORDER BY m.SortOrder;
            """;

		var flat = new List<(int Id, int? ParentId, string Title,
													string? Icon, string? Url, int SortOrder)>();

		try
		{
			await using var cn = new SqlConnection(_conn);
			await using var cmd = new SqlCommand(sql, cn);
			cmd.Parameters.AddWithValue("@UserProfileId", userProfileId);

			await cn.OpenAsync();
			await using var reader = await cmd.ExecuteReaderAsync();

			while (await reader.ReadAsync())
			{
				flat.Add((
						Id: reader.GetInt32(0),
						ParentId: reader.IsDBNull(1) ? null : reader.GetInt32(1),
						Title: reader.GetString(2),
						Icon: reader.IsDBNull(3) ? null : reader.GetString(3),
						Url: reader.IsDBNull(4) ? null : reader.GetString(4),
						SortOrder: reader.GetInt32(5)
				));
			}
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "[MENU] Failed to load menu for user {UserId}", userProfileId);
			return [];
		}

		return BuildTree(flat);
	}

	private static List<MenuItemDto> BuildTree(
			List<(int Id, int? ParentId, string Title,
						string? Icon, string? Url, int SortOrder)> flat)
	{
		// Map সব item
		var lookup = flat.ToDictionary(
				x => x.Id,
				x => new MenuItemDto
				{
					Id = x.Id,
					Title = x.Title,
					Icon = x.Icon,
					Url = x.Url,
					SortOrder = x.SortOrder
				});

		var roots = new List<MenuItemDto>();

		foreach (var item in flat)
		{
			if (item.ParentId is null)
			{
				roots.Add(lookup[item.Id]);
			}
			else if (lookup.TryGetValue(item.ParentId.Value, out var parent))
			{
				parent.Children.Add(lookup[item.Id]);
			}
		}

		// in English:
		return roots
				.Where(r => !r.IsGroup || r.HasChildren)
				.OrderBy(r => r.SortOrder)
				.ToList();
	}
}

