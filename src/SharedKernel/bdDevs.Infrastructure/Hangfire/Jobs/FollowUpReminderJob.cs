using bdDevs.Infrastructure.Data;
using bdDevs.Infrastructure.Hubs;
using Hangfire;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace bdDevs.Infrastructure.Hangfire.Jobs;

public class FollowUpReminderJob(
		AppDbContext db,
		IHubContext<NotificationHub> hub,
		ILogger<FollowUpReminderJob> logger)
{
	[Queue("default")]
	public async Task ExecuteAsync()
	{
		// CRM module ready হলে এখানে Lead query আসবে
		// এখন skeleton রাখো
		logger.LogInformation("[JOB] FollowUpReminderJob executed at {Time}", DateTime.UtcNow);
		await Task.CompletedTask;
	}
}
