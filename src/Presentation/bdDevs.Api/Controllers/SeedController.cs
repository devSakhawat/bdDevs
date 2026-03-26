using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using bdDevs.Infrastructure.Identity;
using bdDevs.Infrastructure.Data;

namespace bdDevs.Api.Api.Controllers;


[ApiController]
[Route("api/seed")]
public class SeedController(
		UserManager<AppUser> userManager,
		AppDbContext db) : ControllerBase
{
	[HttpPost("admin")]
	public async Task<IActionResult> SeedAdmin()
	{
		if (await userManager.FindByNameAsync("admin") is not null)
			return Ok("Admin already exists");

		var user = new AppUser
		{
			UserName = "admin",
			Email = "admin@bddevcrmm.com",
			EmailConfirmed = true
		};

		var result = await userManager.CreateAsync(user, "Admin@12345");
		if (!result.Succeeded)
			return BadRequest(result.Errors);

		db.UserProfiles.Add(new()
		{
			AspNetUserId = user.Id,
			FirstName = "System",
			LastName = "Admin",
			Status = 1,
			CreatedAt = DateTime.UtcNow
		});

		await db.SaveChangesAsync();
		return Ok("Admin seeded successfully");
	}
}


//**২. Postman test sequence:**
//```
//POST  /api/seed/admin          → Admin তৈরি করো(একবার)
//POST  /api/auth/login          → { "username": "admin", "password": "Admin@12345" }
//                                 → accessToken পাবে
//GET / api / auth / refresh        → Cookie থেকে auto refresh
//POST  /api/auth/logout         → Cookie clear