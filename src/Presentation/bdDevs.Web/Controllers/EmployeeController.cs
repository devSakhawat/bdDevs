using Microsoft.AspNetCore.Mvc;

namespace bdDevs.Web.Controllers;

/// <summary>
/// Controller for managing employee records
/// Provides CRUD operations and serves as a reference implementation for other modules
/// </summary>
public class EmployeeController : Controller
{
    /// <summary>
    /// Display the employee list page with grid
    /// </summary>
    /// <returns>Employee index view</returns>
    public IActionResult Index()
    {
        ViewData["Title"] = "Employees";
        ViewData["PageIcon"] = "fa-users";
        ViewData["Subtitle"] = "Manage employee records";
        ViewData["Breadcrumbs"] = new List<(string, string?)>
        {
            ("HR", null),
            ("Employees", null)
        };
        return View();
    }
}
