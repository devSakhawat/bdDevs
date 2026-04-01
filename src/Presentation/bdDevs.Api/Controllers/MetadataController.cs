using Microsoft.AspNetCore.Mvc;

namespace bdDevs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MetadataController : ControllerBase
{
	[HttpGet("sample")]
	public IActionResult GetSample()
	{
		var sample = new
		{
			entityKey = "SampleEntity",
			apiBaseUrl = "/api/sample",
			gridColumns = new[] {
									new { field = "Id", title = "ID", widthPx = 80 },
									new { field = "Name", title = "Name", widthPx = 200 },
									new { field = "Status", title = "Status", widthPx = 120 }
							},
			formFields = new[] {
									new { fieldName = "Name", label = "Name", validation = (object?)new { required = true } },
									new { fieldName = "Status", label = "Status", validation = (object?)null }
							}
		};
		return Ok(sample);
	}
}
