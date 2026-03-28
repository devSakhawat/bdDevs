using Hangfire.Dashboard;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace bdDevs.Infrastructure.Hangfire;

public class HangfireAuthFilter : IDashboardAuthorizationFilter
{
	public bool Authorize(DashboardContext context)
	{
		var http = context.GetHttpContext();

		// always allow access to Hangfire Dashboard in Development environment
		if (http.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
			return true;

		// Authenticate and authorize access to Hangfire Dashboard in Production environment
		return http.User.Identity?.IsAuthenticated == true
				&& http.User.HasClaim("permission", "Admin.Role.Manage");
	}
}
