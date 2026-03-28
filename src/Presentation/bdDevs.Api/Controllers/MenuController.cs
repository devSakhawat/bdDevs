using bdDevs.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace bdDevs.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/menu")]
public class MenuController(IMenuService menuService) : BaseApiController
{
	[HttpGet]
	public async Task<IActionResult> GetMenu()
	{
		var profileId = User.FindFirstValue("profileId");

		if (!long.TryParse(profileId, out var id))
			return ValidationFail("profileId", "Invalid user profile.");

		var menu = await menuService.GetMenuForUserAsync(id);
		return OkResponse(menu);
	}
}
