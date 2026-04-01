using bdDevs.Web.Models.ViewModels;
using System.Text.Json;

namespace bdDevs.Web.Services;

public class WebMenuService(IHttpClientFactory httpFactory,
														 IHttpContextAccessor ctx)
{
	private static readonly JsonSerializerOptions Opts = new()
	{
		PropertyNameCaseInsensitive = true
	};

	public async Task<List<SidebarMenuItemDto>> GetMenuAsync()
	{
		try
		{
			var token = ctx.HttpContext?.Session.GetString("access_token");
			var client = httpFactory.CreateClient("ApiClient");

			//if (!string.IsNullOrEmpty(token))
			//	client.DefaultRequestHeaders.Authorization =
			//			new AuthenticationHeaderValue("Bearer", token);

			//var resp = await client.GetStringAsync("/api/menu");
			//var resp = JsonSerializer.Deserialize<StandardApiResponse<List<MenuItemDto>>>(res, Opts);
			//var tree = BuildMenuTree(flatList);
			//return resp?.Data ?? [];
			var resp = await client.GetStringAsync("/api/menu");
			var flatList = JsonSerializer.Deserialize<List<MenuItemDto>>(resp, Opts) ?? [];
			var tree = BuildMenuTree(flatList);
			return tree;
		}
		catch
		{
			return [];
		}
	}

	// ════════════════════════════════════════════════════════════════
	// PRIVATE: Flat List → Nested Tree
	//
	// ব্যাখ্যা:
	// SQL থেকে আসা flat list-এ সব menu একই level-এ থাকে।
	// ParentMenu column দেখে বোঝা যায় কোনটা কার child।
	//
	// Algorithm:
	// ১. প্রথমে সব item কে SidebarMenuItemDto-তে map করো।
	// ২. একটা Dictionary<int, SidebarMenuItemDto> তৈরি করো (key = MenuId)।
	// ৩. প্রতিটা item-এর ParentMenu check করো:
	//    - null হলে → root list-এ যোগ করো
	//    - non-null হলে → সেই parent-এর Children list-এ যোগ করো
	// ════════════════════════════════════════════════════════════════
	private static List<SidebarMenuItemDto> BuildMenuTree(List<MenuItemDto> flatList)
	{
		// ── সব item কে DTO-তে map করো ────────────────────────────────
		var allItems = flatList.Select(m => new SidebarMenuItemDto
		{
			Id = $"menu-{m.MenuId}",
			Label = m.MenuName,
			Icon = ResolveIcon(m.MenuName, m.ModuleId),
			Url = string.IsNullOrWhiteSpace(m.MenuPath) ? null : m.MenuPath,
			Badge = (m.Todo.HasValue && m.Todo > 0) ? m.Todo.ToString() : null,
			Order = m.Sororder ?? 999,
			Section = null,        // পরে root items-এর জন্য assign হবে
			Children = new List<SidebarMenuItemDto>(),
			RawMenuId = m.MenuId,
			RawParentMenuId = m.ParentMenu
		}).ToList();

		// ── Dictionary তৈরি করো (MenuId → DTO) ───────────────────────
		// এতে parent খোঁজা O(1) time-এ হয়।
		var lookup = allItems.ToDictionary(x => x.RawMenuId);

		// ── Root items collect করার জন্য list ────────────────────────
		var rootItems = new List<SidebarMenuItemDto>();

		foreach (var item in allItems.OrderBy(x => x.Order))
		{
			if (item.RawParentMenuId == null)
			{
				// ── Root item → Section assign করো ───────────────────
				item.Section = ResolveSection(item.Label, item.RawMenuId, allItems);
				rootItems.Add(item);
			}
			else
			{
				// ── Child item → parent-এর Children list-এ যোগ করো ──
				if (lookup.TryGetValue(item.RawParentMenuId.Value, out var parent))
				{
					parent.Children ??= new List<SidebarMenuItemDto>();
					parent.Children.Add(item);
				}
				else
				{
					// Parent টা user-এর permission-এ নেই কিন্তু child আছে —
					// এক্ষেত্রে child কে root-এ রাখো।
					rootItems.Add(item);
				}
			}
		}

		// ── Empty Children list null করো (JSON size ছোট রাখতে) ───────
		CleanEmptyChildren(rootItems);

		return rootItems;
	}

	private static void CleanEmptyChildren(List<SidebarMenuItemDto> items)
	{
		foreach (var item in items)
		{
			if (item.Children != null)
			{
				if (item.Children.Count == 0)
					item.Children = null;
				else
					CleanEmptyChildren(item.Children);
			}
		}
	}

	// ════════════════════════════════════════════════════════════════
	// PRIVATE: Icon Resolver
	//
	// ব্যাখ্যা:
	// DB-তে icon store নেই, তাই MenuName এবং ModuleId দেখে
	// Font Awesome class assign করা হয়।
	// আপনি এখানে নিজের project অনুযায়ী icons যোগ করুন।
	// ════════════════════════════════════════════════════════════════
	private static string ResolveIcon(string menuName, int moduleId)
	{
		// ── MenuName দেখে exact match ─────────────────────────────────
		var nameMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
						{
                // Dashboard
                { "dashboard",          "fa-solid fa-gauge-high" },
								{ "home",               "fa-solid fa-house" },

                // CRM
                { "crm",                "fa-solid fa-briefcase" },
								{ "contacts",           "fa-solid fa-address-book" },
								{ "leads",              "fa-solid fa-funnel-dollar" },
								{ "accounts",           "fa-solid fa-building" },
								{ "opportunities",      "fa-solid fa-handshake" },
								{ "activities",         "fa-solid fa-calendar-check" },
								{ "pipeline",           "fa-solid fa-chart-gantt" },
								{ "customers",          "fa-solid fa-users" },
								{ "deals",              "fa-solid fa-tags" },
								{ "quotations",         "fa-solid fa-file-invoice" },

                // HR
                { "human resources",    "fa-solid fa-users" },
								{ "hr",                 "fa-solid fa-users" },
								{ "employees",          "fa-solid fa-user-tie" },
								{ "departments",        "fa-solid fa-sitemap" },
								{ "designations",       "fa-solid fa-id-badge" },
								{ "leave management",   "fa-solid fa-calendar-xmark" },
								{ "leave",              "fa-solid fa-calendar-xmark" },
								{ "leave types",        "fa-solid fa-tags" },
								{ "leave requests",     "fa-solid fa-inbox" },
								{ "leave balance",      "fa-solid fa-scale-balanced" },
								{ "onboarding",         "fa-solid fa-user-plus" },
								{ "documents",          "fa-solid fa-folder-open" },
								{ "training",           "fa-solid fa-graduation-cap" },
								{ "recruitment",        "fa-solid fa-magnifying-glass-plus" },

                // Payroll
                { "payroll",            "fa-solid fa-money-bill-wave" },
								{ "salary",             "fa-solid fa-wallet" },
								{ "salary structure",   "fa-solid fa-layer-group" },
								{ "pay slips",          "fa-solid fa-file-invoice-dollar" },
								{ "deductions",         "fa-solid fa-minus-circle" },
								{ "allowances",         "fa-solid fa-plus-circle" },
								{ "tax",                "fa-solid fa-percent" },
								{ "tax setup",          "fa-solid fa-percent" },
								{ "process payroll",    "fa-solid fa-play-circle" },
								{ "bonus",              "fa-solid fa-gift" },

                // Attendance
                { "attendance",         "fa-solid fa-clock" },
								{ "daily attendance",   "fa-solid fa-calendar-day" },
								{ "monthly report",     "fa-solid fa-calendar-alt" },
								{ "shift management",   "fa-solid fa-rotate" },
								{ "shifts",             "fa-solid fa-rotate" },
								{ "overtime",           "fa-solid fa-hourglass-half" },
								{ "holidays",           "fa-solid fa-umbrella-beach" },

                // Reports
                { "reports",            "fa-solid fa-chart-bar" },
								{ "crm reports",        "fa-solid fa-chart-line" },
								{ "hr reports",         "fa-solid fa-chart-pie" },
								{ "payroll reports",    "fa-solid fa-receipt" },
								{ "attendance reports", "fa-solid fa-table" },
								{ "analytics",          "fa-solid fa-chart-mixed" },

                // Administration
                { "administration",     "fa-solid fa-shield-halved" },
								{ "admin",              "fa-solid fa-shield-halved" },
								{ "users",              "fa-solid fa-users-gear" },
								{ "roles",              "fa-solid fa-user-lock" },
								{ "permissions",        "fa-solid fa-key" },
								{ "settings",           "fa-solid fa-sliders" },
								{ "audit logs",         "fa-solid fa-scroll" },
								{ "backup",             "fa-solid fa-database" },
								{ "configuration",      "fa-solid fa-gear" },
						};

		if (nameMap.TryGetValue(menuName.Trim(), out var icon))
			return icon;

		// ── ModuleId দেখে fallback ────────────────────────────────────
		return moduleId switch
		{
			1 => "fa-solid fa-briefcase",       // CRM
			2 => "fa-solid fa-users",            // HR
			3 => "fa-solid fa-money-bill-wave",  // Payroll
			4 => "fa-solid fa-clock",            // Attendance
			5 => "fa-solid fa-chart-bar",        // Reports
			9 => "fa-solid fa-shield-halved",    // Admin
			_ => "fa-solid fa-circle-dot"        // Default
		};
	}

	// ════════════════════════════════════════════════════════════════
	// PRIVATE: Section Resolver
	// Root item-গুলোকে visual group-এ ভাগ করে।
	// ════════════════════════════════════════════════════════════════
	private static string? ResolveSection(string menuName, int menuId, List<SidebarMenuItemDto> allItems)
	{
		var sectionMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
						{
								{ "dashboard",       "Overview" },
								{ "home",            "Overview" },
								{ "crm",             "Business" },
								{ "human resources", "HR & Payroll" },
								{ "hr",              "HR & Payroll" },
								{ "payroll",         "HR & Payroll" },
								{ "attendance",      "HR & Payroll" },
								{ "reports",         "Analytics" },
								{ "analytics",       "Analytics" },
								{ "administration",  "System" },
								{ "admin",           "System" },
								{ "settings",        "System" },
						};

		if (sectionMap.TryGetValue(menuName.Trim(), out var section))
			return section;

		return null; // Section না থাকলে divider দেখাবে না
	}



}
