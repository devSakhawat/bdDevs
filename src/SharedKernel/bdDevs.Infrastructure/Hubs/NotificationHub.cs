using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace bdDevs.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub
{
	public override async Task OnConnectedAsync()
	{
		var userId = Context.User?.FindFirst("profileId")?.Value;
		var branchId = Context.User?.FindFirst("branchId")?.Value;

		if (!string.IsNullOrEmpty(userId))
			await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");

		if (!string.IsNullOrEmpty(branchId))
			await Groups.AddToGroupAsync(Context.ConnectionId, $"branch-{branchId}");

		await base.OnConnectedAsync();
	}

	public async Task JoinGroup(string groupName) =>
			await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
}
