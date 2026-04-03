using Microsoft.AspNetCore.Mvc;

namespace bdDevs.Web.Controllers;

public class MenuManagementController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
