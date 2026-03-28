using Microsoft.Extensions.Logging;
using Hangfire;

namespace bdDevs.Infrastructure.Hangfire.Jobs;

public class CommunicationQueueJob(ILogger<CommunicationQueueJob> logger)
{
	[Queue("default")]
	public async Task ExecuteAsync()
	{
		// Communication module ready হলে email/SMS queue process হবে
		logger.LogInformation("[JOB] CommunicationQueueJob executed at {Time}", DateTime.UtcNow);
		await Task.CompletedTask;
	}
}
