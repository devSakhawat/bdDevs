using Hangfire;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace bdDevs.Infrastructure.Hangfire;

public class JobService(IBackgroundJobClient jobClient,
												IRecurringJobManager recurringJobManager) : IJobService
{
	public string Enqueue<T>(string queue = "default") where T : IBackgroundJob
	{
		return jobClient.Enqueue<T>(
				job => job.ExecuteAsync(CancellationToken.None));
	}

	public string Enqueue(Expression<Action> methodCall, string queue = "default")
	{
		return jobClient.Enqueue(methodCall);
	}

	public string Schedule(Expression<Action> methodCall, TimeSpan delay)
	{
		return jobClient.Schedule(methodCall, delay);
	}

	public void AddOrUpdateRecurring(
			string jobId,
			Expression<Action> methodCall,
			string cronExpression,
			string queue = "default")
	{
		recurringJobManager.AddOrUpdate(jobId, methodCall, cronExpression);
	}

	public void RemoveRecurring(string jobId)
	{
		recurringJobManager.RemoveIfExists(jobId);
	}
}
