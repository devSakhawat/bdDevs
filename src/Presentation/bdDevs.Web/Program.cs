using bdDevs.Web.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSession(opt =>
{
	opt.IdleTimeout = TimeSpan.FromMinutes(30);
	opt.Cookie.HttpOnly = true;
	opt.Cookie.IsEssential = true;
});
builder.Services.AddHttpContextAccessor();

// API HTTP client
builder.Services.AddHttpClient("ApiClient", client =>
{
	client.BaseAddress = new Uri(
			builder.Configuration["ApiBaseUrl"] ?? "https://localhost:5001");
});

builder.Services.AddScoped<WebMenuService>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
		name: "default",
		pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
