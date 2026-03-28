using bdDevs.Application.Common.Interfaces;
using bdDevs.Infrastructure.Data;
using bdDevs.Infrastructure.Hangfire;
using bdDevs.Infrastructure.Hangfire.Jobs;
using bdDevs.Infrastructure.Identity;
using bdDevs.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace bdDevs.Infrastructure.Extensions;

public static class InfrastructureServiceExtensions
{
	public static IServiceCollection AddInfrastructure(
			this IServiceCollection services,
			IConfiguration config)
	{
		// ── Database ──
		services.AddDbContext<AppDbContext>(opt =>
				opt.UseSqlServer(config.GetConnectionString("Default"),
						sql => sql.MigrationsAssembly(
								typeof(AppDbContext).Assembly.FullName)));

		// ── Identity ──
		services.AddIdentity<AppUser, IdentityRole>(opt =>
		{
			opt.Password.RequireDigit = true;
			opt.Password.RequiredLength = 8;
			opt.Password.RequireNonAlphanumeric = false;
			opt.Lockout.MaxFailedAccessAttempts = 5;
			opt.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
		})
		.AddEntityFrameworkStores<AppDbContext>()
		.AddDefaultTokenProviders();

		// ── JWT Authentication ──
		services.AddAuthentication(opt =>
		{
			opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
			opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
		})
		.AddJwtBearer(opt =>
		{
			opt.TokenValidationParameters = new TokenValidationParameters
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,
				ValidIssuer = config["Jwt:Issuer"],
				ValidAudience = config["Jwt:Audience"],
				IssuerSigningKey = new SymmetricSecurityKey(
									Encoding.UTF8.GetBytes(config["Jwt:Secret"]!)),
				ClockSkew = TimeSpan.Zero
			};

			// SignalR support
			opt.Events = new JwtBearerEvents
			{
				OnMessageReceived = ctx =>
				{
					var token = ctx.Request.Query["access_token"];
					var path = ctx.HttpContext.Request.Path;
					if (!string.IsNullOrEmpty(token) &&
									path.StartsWithSegments("/hubs"))
						ctx.Token = token;
					return Task.CompletedTask;
				}
			};
		});

		// ── Redis ──
		services.AddStackExchangeRedisCache(opt =>
		{
			opt.Configuration = config.GetConnectionString("Redis");
			opt.InstanceName = "bdDevs_";
		});

		// ── Services ──
		services.AddScoped<ICacheService, RedisCacheService>();
		services.AddScoped<IJwtService, JwtService>();
		services.AddScoped<IAuthService, AuthService>();
		services.AddScoped<IJobService, JobService>();
		services.AddScoped<FollowUpReminderJob>();
		services.AddScoped<CommunicationQueueJob>();

		// Menu & Permission services
		services.AddScoped<MenuService>();
		services.AddScoped<IMenuService, CachedMenuService>();
		services.AddScoped<IPermissionService, PermissionService>();

		services.AddHangfireServices(config);

		return services;
	}
}