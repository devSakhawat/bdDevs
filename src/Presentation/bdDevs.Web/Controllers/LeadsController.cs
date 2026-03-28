using Microsoft.AspNetCore.Mvc;

namespace bdDevs.Web.Controllers;

public class LeadsController : Controller
{
	public IActionResult Index()
	{
		ViewData["Title"] = "Leads";
		ViewData["PageIcon"] = "fa-funnel";
		ViewData["Subtitle"] = "Manage and track all leads";
		ViewData["Breadcrumbs"] = new List<(string, string?)>
		{
				("CRM",   null),
				("Leads", null)
		};
		return View();
	}
}
