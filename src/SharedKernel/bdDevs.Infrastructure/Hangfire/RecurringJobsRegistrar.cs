//using bdDevs.Infrastructure.Hangfire.Jobs;
//using Hangfire;
//using System;
//using System.Collections.Generic;
//using System.Text;

//namespace bdDevs.Infrastructure.Hangfire;

//public static class RecurringJobsRegistrar
//{
//	public static void RegisterAll()
//	{
//		// Follow-up reminders — every 5 minutes
//		RecurringJob.AddOrUpdate<FollowUpReminderJob>(
//				recurringJobId: "followup-reminders",
//				methodCall: job => job.ExecuteAsync(),
//				cronExpression: "*/5 * * * *",
//				queue: "default");

//		// Communication queue processor — every 1 minute
//		RecurringJob.AddOrUpdate<CommunicationQueueJob>(
//				recurringJobId: "communication-queue",
//				methodCall: job => job.ExecuteAsync(),
//				cronExpression: "* * * * *",
//				queue: "default");
//	}
//}
