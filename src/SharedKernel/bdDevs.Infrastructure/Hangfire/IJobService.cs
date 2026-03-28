using System.Linq.Expressions;

namespace bdDevs.Infrastructure.Hangfire;

public interface IJobService
{
	// Fire-and-forget
	string Enqueue<T>(string queue = "default") where T : IBackgroundJob;
	string Enqueue(Expression<Action> methodCall, string queue = "default");

	// Delayed
	string Schedule(Expression<Action> methodCall, TimeSpan delay);

	// Recurring
	void AddOrUpdateRecurring(
			string jobId,
			Expression<Action> methodCall,
			string cronExpression,
			string queue = "default");

	void RemoveRecurring(string jobId);
}

public interface IBackgroundJob
{
	Task ExecuteAsync(CancellationToken ct = default);
}
