using Microsoft.OpenApi;

/// <summary>
/// Provides extension methods for <see cref="IServiceCollection"/> to configure Swagger/OpenAPI 
/// for the bdDevs platform.
/// </summary>
public static class SwaggerServiceExtensions
{
	/// <summary>
	/// Adds and configures Swagger generation services with JWT Bearer authentication support.
	/// </summary>
	/// <param name="services">The <see cref="IServiceCollection"/> to add services to.</param>
	/// <returns>The same <see cref="IServiceCollection"/> for method chaining.</returns>
	/// <remarks>
	/// This method configures a global security requirement using the "Bearer" scheme. 
	/// In the Swagger UI, users should provide the token in the format: "Bearer {your_token}".
	/// Note: This implementation is compatible with Microsoft.OpenApi v1.0+ and Swashbuckle 10.x.
	/// </remarks>
	public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
	{
		services.AddSwaggerGen(opt =>
		{
			// Configure the main OpenAPI document metadata
			opt.SwaggerDoc("v1", new OpenApiInfo
			{
				Title = "bdDevs API",
				Version = "v1",
				Description = "Enterprise CRM + HR/Payroll Platform"
			});

			// Define the JWT Security Scheme
			var jwtScheme = new OpenApiSecurityScheme
			{
				Name = "Authorization",
				Type = SecuritySchemeType.Http,
				Scheme = "bearer",
				BearerFormat = "JWT",
				In = ParameterLocation.Header,
				Description = "Enter your JWT token. Example: Bearer eyJhbGci..."
			};

			// Register the security definition in Swagger
			opt.AddSecurityDefinition("Bearer", jwtScheme);

			// Create a global security requirement for all endpoints
			var securityRequirement = new OpenApiSecurityRequirement
						{
								{
                    // Map the requirement to the "Bearer" definition using a Reference object
                    new OpenApiSecuritySchemeReference("Bearer"),
										new List<string>() // Values must be an empty list for non-OAuth2 schemes
                }
						};

			// Register the requirement using a Func lambda to satisfy the Swashbuckle 10.x signature
			// The underscore (_) represents the OpenApiDocument which is ignored here.
			opt.AddSecurityRequirement(_ => securityRequirement);
		});

		return services;
	}
}


//using Microsoft.OpenApi;

//namespace bdDevs.Api.Swagger;

//public static class SwaggerServiceExtensions
//{
//	public static IServiceCollection AddSwaggerWithJwt(this IServiceCollection services)
//	{
//		services.AddSwaggerGen(opt =>
//		{
//			opt.SwaggerDoc("v1", new OpenApiInfo
//			{
//				Title = "bdDevs API",
//				Version = "v1",
//				Description = "Enterprise CRM + HR/Payroll Platform"
//			});

//			// JWT Bearer in Swagger UI
//			var jwtScheme = new OpenApiSecurityScheme
//			{
//				Name = "Authorization",
//				Type = SecuritySchemeType.Http,
//				Scheme = "bearer",
//				BearerFormat = "JWT",
//				In = ParameterLocation.Header,
//				Description = "Enter your JWT token. Example: eyJhbGci...",
//				Reference = new OpenApiReference
//				{
//					Id = "Bearer",
//					Type = ReferenceType.SecurityScheme
//				}
//			};

//			opt.AddSecurityDefinition("Bearer", jwtScheme);
//			opt.AddSecurityRequirement(new OpenApiSecurityRequirement
//						{
//								{ jwtScheme, Array.Empty<string>() }
//						});
//		});

//		return services;
//	}
//}