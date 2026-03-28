using Microsoft.AspNetCore.Mvc;

namespace bdDevs.Web.Controllers
{
	public class LayoutBaseController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
	}
}
