using bdDevs.Api.Hubs;
using bdDevs.Api.Middleware;
using bdDevs.Application.Extensions;
using bdDevs.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddInfrastructure(builder.Configuration).AddApplicationServices().AddSignalR().Services.AddControllers();
// alternatively, to keep it more organized:
builder.Services.AddInfrastructure(builder.Configuration);
//builder.Services.AddApplicationServices();
builder.Services.AddApplicationServices(typeof(bdDevs.Application.Common.Behaviors.ValidationBehavior<,>));
builder.Services.AddSignalR();
builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerWithJwt(); // ← JWT-enabled Swagger

// Authorization Policies
builder.Services.AddAuthorization(opt =>
{
	// Permission-based policies — pattern: "Module.Resource.Action"
	var permissions = new[]
	{
				"CRM.Lead.View",   "CRM.Lead.Create",   "CRM.Lead.Edit",
				"CRM.Lead.Delete", "CRM.Lead.Assign",
				"CRM.Student.View","CRM.Student.Create", "CRM.Student.Edit",
				"CRM.Application.View","CRM.Application.Create","CRM.Application.Edit",
				"Admin.User.View", "Admin.User.Create",  "Admin.User.Edit",
				"Admin.Role.View", "Admin.Role.Manage",
		};

	foreach (var perm in permissions)
	{
		opt.AddPolicy(perm, policy =>
				policy.RequireClaim("permission", perm));
	}
});

var app = builder.Build();

// ── Middleware Pipeline ──
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.Run();








//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.

//var app = builder.Build();

//// Configure the HTTP request pipeline.

//app.UseHttpsRedirection();

//var summaries = new[]
//{
//    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
//};

//app.MapGet("/weatherforecast", () =>
//{
//    var forecast =  Enumerable.Range(1, 5).Select(index =>
//        new WeatherForecast
//        (
//            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//            Random.Shared.Next(-20, 55),
//            summaries[Random.Shared.Next(summaries.Length)]
//        ))
//        .ToArray();
//    return forecast;
//});

//app.Run();

//record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
//{
//    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
//}
