using bdDevs.Contracts.Responses;
using System.Net.Http.Headers;
using System.Text.Json;

namespace bdDevs.Web.Services;

public class WebMenuService(IHttpClientFactory httpFactory,
														 IHttpContextAccessor ctx)
{
	private static readonly JsonSerializerOptions Opts = new()
	{
		PropertyNameCaseInsensitive = true
	};

	public async Task<List<MenuItemDto>> GetMenuAsync()
	{
		try
		{
			var token = ctx.HttpContext?.Session.GetString("access_token");
			var client = httpFactory.CreateClient("ApiClient");

			if (!string.IsNullOrEmpty(token))
				client.DefaultRequestHeaders.Authorization =
						new AuthenticationHeaderValue("Bearer", token);

			var res = await client.GetStringAsync("/api/menu");
			var resp = JsonSerializer.Deserialize<StandardApiResponse<List<MenuItemDto>>>(res, Opts);
			return resp?.Data ?? [];
		}
		catch
		{
			return [];
		}
	}
}
