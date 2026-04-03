using bdDevs.Application.Features.Menus.Commands;
using bdDevs.Application.Features.Menus.Queries;
using bdDevs.Contracts.Requests;
using bdDevs.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace bdDevs.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MenuController(IMenuService menuService) : BaseApiController
{
	/// <summary>
	/// Get menu tree for authenticated user (with permissions)
	/// </summary>
	[HttpGet("user-menu")]
	public async Task<IActionResult> GetUserMenu()
	{
		var profileId = User.FindFirstValue("profileId");

		if (!long.TryParse(profileId, out var id))
			return ValidationFail("profileId", "Invalid user profile.");

		var menu = await menuService.GetMenuForUserAsync(id);
		return OkResponse(menu);
	}

	/// <summary>
	/// Get all menus (for admin management)
	/// </summary>
	[HttpGet]
	public async Task<IActionResult> GetAllMenus()
	{
		var result = await Mediator.Send(new GetAllMenusQuery());
		return OkResponse(result);
	}

	/// <summary>
	/// Get menu by ID
	/// </summary>
	[HttpGet("{id:int}", Name = "GetMenuById")]
	public async Task<IActionResult> GetMenuById(int id)
	{
		var result = await Mediator.Send(new GetMenuByIdQuery(id));

		if (result == null)
			return NotFoundResponse("Menu", id);

		return OkResponse(result);
	}

	/// <summary>
	/// Get menus by Module ID
	/// </summary>
	[HttpGet("module/{moduleId:int}")]
	public async Task<IActionResult> GetMenusByModule(int moduleId)
	{
		var result = await Mediator.Send(new GetMenusByModuleQuery(moduleId));
		return OkResponse(result);
	}

	/// <summary>
	/// Create a new menu
	/// </summary>
	[HttpPost]
	public async Task<IActionResult> CreateMenu([FromBody] CreateMenuRequest request)
	{
		if (!ModelState.IsValid)
			return ValidationFail("request", "Invalid menu data.");

		var result = await Mediator.Send(new CreateMenuCommand(request));
		return CreatedResponse("GetMenuById", new { id = result.MenuId }, result);
	}

	/// <summary>
	/// Update an existing menu
	/// </summary>
	[HttpPut("{id:int}")]
	public async Task<IActionResult> UpdateMenu(int id, [FromBody] UpdateMenuRequest request)
	{
		if (id != request.MenuId)
			return ValidationFail("id", "Menu ID mismatch.");

		if (!ModelState.IsValid)
			return ValidationFail("request", "Invalid menu data.");

		var result = await Mediator.Send(new UpdateMenuCommand(request));

		if (result == null)
			return NotFoundResponse("Menu", id);

		return OkResponse(result);
	}

	/// <summary>
	/// Delete a menu
	/// </summary>
	[HttpDelete("{id:int}")]
	public async Task<IActionResult> DeleteMenu(int id)
	{
		var success = await Mediator.Send(new DeleteMenuCommand(id));

		if (!success)
			return NotFoundResponse("Menu", id);

		return OkResponse(new { message = "Menu deleted successfully." });
	}
}
