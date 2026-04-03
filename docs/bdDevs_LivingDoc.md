


**bdDevCRM**

Living Project Documentation

|<p>Context Document — Share this with Claude at the start of every session</p><p>**Last Updated: Phase 1A — Step 7.2 Complete ✅  |  Next: Step 7.3 Theme Platform**</p>|
| :-: |

*⚠️  পরের session শুরু করার আগে এই document-টি Claude-কে দিন এবং বলুন: "এই document পড়ো এবং কোথা থেকে শুরু করতে হবে বলো"*


# **1. Project Snapshot**

|**Field**|**Value**|
| :- | :- |
|Project Name|bdDevCRM|
|Type|Enterprise CRM + HR/Payroll Platform|
|Developer|Solo Developer (devSakhawat)|
|Frontend|ASP.NET Core MVC + Kendo UI for jQuery|
|Backend|Modular Monolith — Clean Architecture + CQRS (MediatR)|
|Auth|ASP.NET Core Identity + JWT Bearer Tokens|
|Database|SQL Server — Database-First + EF Core|
|Cache|Redis (Session + Permission + Query cache)|
|Real-time|SignalR (NotificationHub)|
|Background Jobs|Hangfire (SQL Server storage)|
|Deployment|Docker + Kubernetes — On-premise / VPS|
|Frontend JS|Full TypeScript + esbuild (compiled to wwwroot/js/dist/)|
|Current Phase|Phase 1A — Foundation|
|Current Step|Step 7.3 — Theme Platform (IN PROGRESS)|

# **2. Solution Structure**

|<p>bdDevCRM/</p><p>├── src/</p><p>│   ├── Presentation/</p><p>│   │   ├── bdDevCRM.API/          ← ASP.NET Core Web API</p><p>│   │   └── bdDevCRM.Web/          ← ASP.NET Core MVC (Frontend)</p><p>│   │       ├── ts-src/            ← TypeScript source</p><p>│   │       │   ├── bundle.ts      ← Entry point</p><p>│   │       │   ├── types/         ← api.types, grid.types, theme.types, ui.types</p><p>│   │       │   ├── core/          ← api-service, loading, toast, event-bus</p><p>│   │       │   ├── services/      ← auth, theme, menu, grid, navigation</p><p>│   │       │   └── components/    ← bd-modal, command-palette, notification-center, form-guard</p><p>│   │       ├── wwwroot/</p><p>│   │       │   ├── js/dist/       ← compiled bundle.js (esbuild output)</p><p>│   │       │   ├── css/           ← layout, themes, sidebar, components</p><p>│   │       │   └── js/            ← shell-init.js (plain JS boot)</p><p>│   │       └── Views/</p><p>│   │           ├── Shared/        ← \_Layout, \_Topbar, \_Footer, \_Sidebar,</p><p>│   │           │                     \_NotificationPanel, \_CommandPalette,</p><p>│   │           │                     \_PageHeader, \_ToastHost</p><p>│   │           └── Templates/     ← \_GridPageShell, \_FormPageShell, \_PageHeader</p><p>│   ├── Modules/</p><p>│   │   ├── Modules.CRM/</p><p>│   │   ├── Modules.HR/</p><p>│   │   ├── Modules.Attendance/</p><p>│   │   └── Modules.Reporting/</p><p>│   ├── SharedKernel/</p><p>│   │   ├── bdDevCRM.Domain/</p><p>│   │   ├── bdDevCRM.Application/</p><p>│   │   └── bdDevCRM.Infrastructure/</p><p>│   └── CrossCutting/</p><p>│       ├── bdDevCRM.Common/</p><p>│       └── bdDevCRM.Contracts/</p><p>└── tests/</p>|
| :- |

# **3. TypeScript + esbuild Setup**

|**File**|**Location**|**Purpose**|
| :- | :- | :- |
|package.json|bdDevCRM.Web/|npm scripts: build, watch, build:prod|
|tsconfig.json|bdDevCRM.Web/|TS config — ES2020, strict, path aliases|
|build.js|bdDevCRM.Web/|esbuild config — IIFE format, sourcemap dev, minify prod|
|bundle.ts|ts-src/|Entry point — imports all services, exposes to window|
|shell-init.js|wwwroot/js/|Plain JS boot sequence — runs after bundle loads|

|<p>**Window Globals (exposed by bundle.ts)**</p><p>window.bdApi       → BdApiService (HTTP fetch wrapper)</p><p>window.bdToast     → ToastService (success/error/warning/info)</p><p>window.bdLoading   → LoadingService (3-level loading)</p><p>window.bdNav       → NavigationService (breadcrumb + active menu)</p><p>window.eventBus    → EventBus (internal pub/sub)</p><p>window.bdEvents    → Events constants</p><p>window.bdShowForm  → Grid/Form toggle (Type 3 pattern)</p><p>window.bdHideForm  → Grid/Form toggle close</p><p>window.bdFormSaving→ Form save button state</p>|
| :- |

# **4. Database — Tables Created**
## **4.1 Schema: dbo (Shared/Auth)**

|**Table**|**Description**|**Status**|
| :- | :- | :- |
|UserProfiles|Identity user extension (1-1 with AspNetUsers)|✅ Created|
|Roles|Custom application roles|✅ Created|
|Permissions|Module.Resource.Action granular permissions|✅ Created|
|UserRoles|User ↔ Role mapping|✅ Created|
|RolePermissions|Role ↔ Permission mapping|✅ Created|
|RefreshTokens|JWT refresh token storage with rotation|✅ Created|
|Menus|Dynamic permission-filtered sidebar menu|✅ Created|
|AuditLogs|Entity change tracking log|✅ Created|

# **5. Phase & Step Progress Tracker**


|**PHASE 1A — Foundation**|
| :-: |

|✅|<p>**Step 1 — Solution Structure + Project Setup**</p><p>13 projects, sln references, NuGet packages, project references configured</p>|
| :-: | :- |

|✅|<p>**Step 2 — SharedKernel Infrastructure**</p><p>AppDbContext, Identity, JWT, Redis, InfrastructureServiceExtensions, AuthController, Program.cs — Build SUCCESS</p>|
| :-: | :- |

|✅|<p>**Step 3 — BaseApiController + HATEOAS + Auth API Test**</p><p>BaseApiController, LinkedResource<T>, ILinkFactory<T>, SwaggerWithJwt, NotificationHub, Middlewares, SeedController — Build SUCCESS</p>|
| :-: | :- |

|✅|<p>**Step 4 — Serilog + Middleware Pipeline**</p><p>RequestLoggingMiddleware, LoggingBehavior, CachingBehavior, ICacheService, RedisCacheService, SerilogExtensions — Build SUCCESS</p>|
| :-: | :- |

|✅|<p>**Step 5 — Hangfire Setup**</p><p>HangfireExtensions, HangfireAuthFilter, IJobService, JobService, FollowUpReminderJob, CommunicationQueueJob, RecurringJobsRegistrar — Build SUCCESS</p>|
| :-: | :- |

|✅|<p>**Step 6 — Menu + Permission System**</p><p>MenuService (raw SQL), CachedMenuService, PermissionService, MenuController, WebMenuService, \_Sidebar.cshtml, sidebar.css, sidebar.js — Build SUCCESS</p>|
| :-: | :- |

|**Step 7 — MVC Web Layout Platform**|
| :-: |

|✅|<p>**Step 7.0 — TypeScript + esbuild Setup**</p><p>package.json, tsconfig.json, build.js, ts-src/ folder structure, all type definitions (api.types, grid.types, theme.types, ui.types), event-bus.ts, api-service.ts, bundle.ts — npm run build SUCCESS → wwwroot/js/dist/bundle.js</p>|
| :-: | :- |

|✅|<p>**Step 7.1 — App Shell Foundation**</p><p>\_Layout.cshtml, layout.css (CSS Grid shell), loading.ts, toast.ts, shell-init.js, \_NotificationPanel.cshtml, \_CommandPalette.cshtml, \_Footer.cshtml, App skeleton loader, mobile sidebar overlay + backdrop, sidebar toggle (desktop collapse + mobile overlay), Ctrl+B shortcut, session guard bootstrap — Build SUCCESS</p>|
| :-: | :- |

|✅|<p>**Step 7.2 — Navigation Intelligence**</p><p>navigation-service.ts (ROUTE\_MAP, resolve, apply, register), \_PageHeader.cshtml, \_GridPageShell.cshtml (Type 3 grid/form toggle), \_FormPageShell.cshtml (Kendo TabStrip + sticky save bar), components.css (page-header, grid-page, form-shell styles), Ctrl+S save shortcut, breadcrumb auto-render, active menu sync, SPA popstate nav — Build SUCCESS</p>|
| :-: | :- |

|🔄|<p>**Step 7.3 — Theme Platform**</p><p>IN PROGRESS — themes.css, theme-service.ts, ThemeController, 3-layer theme (family + mode + density), runtime CSS swap, DB persist, cookie no-flicker</p>|
| :-: | :- |

|⏳|<p>**Step 7.4 — Feedback System**</p><p>NProgress page loader, toast categories, global error banner, ajax hooks</p>|
| :-: | :- |

|⏳|<p>**Step 7.5 — Session + Security UX**</p><p>session-guard.ts full, form dirty check (form-guard.ts), inactivity detection</p>|
| :-: | :- |

|⏳|<p>**Step 7.6 — Interaction Components**</p><p>bd-modal.ts (Kendo Window generic wrapper), notification-center.ts, command-palette.ts, keyboard shortcuts full</p>|
| :-: | :- |

|⏳|<p>**Step 7.7 — Page Templates / Patterns**</p><p>\_EmptyState.cshtml, grid-base.ts, global grid toolbar standard</p>|
| :-: | :- |

|**PHASE 1B — CRM: Lead Module**|
| :-: |

|⏳|<p>**Lead Entity + DB Tables**</p><p>crm schema tables, scaffold, LeadLinkFactory</p>|
| :-: | :- |

|⏳|<p>**Lead CRUD Commands + Queries**</p><p>CreateLead, UpdateLead, GetLeadById, GetLeadGrid (LINQ pipeline)</p>|
| :-: | :- |

|⏳|<p>**Lead Activities + Follow-up**</p><p>LeadActivity log, SignalR follow-up reminders</p>|
| :-: | :- |

|⏳|<p>**Lead Assignment (Round-robin)**</p><p>Auto-assign service + manual assign endpoint</p>|
| :-: | :- |

|⏳|<p>**Lead → Student Conversion**</p><p>ConvertLeadToStudent command + domain event</p>|
| :-: | :- |


# **6. Next Step — Step 7.3 Detail**

|**🔄  Step 7.3: Theme Platform**|
| :-: |

## **6.1 কী কী করতে হবে**
- themes.css — CSS variables per theme family + mode + density
- theme-service.ts — runtime Kendo CSS link swap, no page reload
- Theme picker UI — family selector + light/dark toggle + density toggle
- DB persist — PUT /api/user/theme → UserProfiles.SettingsJson
- Cookie set — server-side for no-flicker on page load
- localStorage fallback — offline/fast load
- OS prefers-color-scheme detection on first login
- ThemeController.cs — API endpoint

## **6.2 Files to Create in Step 7.3**

|**File**|**Project**|**Purpose**|
| :- | :- | :- |
|wwwroot/css/themes.css|bdDevCRM.Web|CSS variables for all theme combinations|
|ts-src/services/theme-service.ts|bdDevCRM.Web|3-layer theme switch + persist|
|Controllers/UserPreferenceController.cs|bdDevCRM.API|PUT /api/user/theme|
|ts-src/components/theme-picker.ts|bdDevCRM.Web|Theme picker dropdown UI|

## **6.3 Theme System — 3 Layers**

|**Layer**|**Options**|**Storage**|
| :- | :- | :- |
|Layer 1: Theme Family|default, bootstrap, material, fluent|UserProfiles.SettingsJson|
|Layer 2: Mode|light, dark|UserProfiles.SettingsJson + Cookie|
|Layer 3: Density|compact, comfortable|UserProfiles.SettingsJson|

|<p>**UserProfiles.SettingsJson shape**</p><p>{ "themeFamily": "bootstrap", "themeMode": "dark", "density": "compact",</p><p>`  `"sidebarCollapsed": false, "gridDefaults": { "pageSize": 20 } }</p>|
| :- |

# **7. All Completed Files — Reference**

## **Step 1 — Solution Structure**

|**File/Item**|**Purpose**|
| :- | :- |
|bdDevCRM.sln|Solution with 13 projects|
|Project references|Contracts→Common→Domain→Application→Infrastructure→Modules→API/Web|
|NuGet packages|MediatR, FluentValidation, EF Core, Identity, Redis, Hangfire, Serilog, JWT, Mapster|

## **Step 2 — SharedKernel Infrastructure**

|**File**|**Project**|**Purpose**|
| :- | :- | :- |
|Domain/Common/BaseEntity.cs|bdDevCRM.Domain|Id + DomainEvents|
|Domain/Common/AuditableEntity.cs|bdDevCRM.Domain|Extends BaseEntity + IAuditableEntity|
|Domain/Common/IAuditableEntity.cs|bdDevCRM.Domain|Interface: CreatedAt, ModifiedAt|
|Domain/Common/IDomainEvent.cs|bdDevCRM.Domain|Marker interface (INotification)|
|Contracts/Responses/StandardApiResponse.cs|bdDevCRM.Contracts|Unified response wrapper|
|Contracts/Responses/PaginationMetadata.cs|bdDevCRM.Contracts|Pagination info|
|Contracts/Responses/LinkDto.cs|bdDevCRM.Contracts|HATEOAS link record|
|Contracts/Responses/FieldError.cs|bdDevCRM.Contracts|Field-level error record|
|Contracts/Requests/GridRequestParams.cs|bdDevCRM.Contracts|Standard grid request|
|Identity/AppUser.cs|bdDevCRM.Infrastructure|IdentityUser + Profile nav|
|Identity/IJwtService.cs|bdDevCRM.Infrastructure|JWT interface|
|Identity/JwtService.cs|bdDevCRM.Infrastructure|JWT impl — claims: userId, profileId, branchId, roles, permissions|
|Identity/IAuthService.cs|bdDevCRM.Infrastructure|Auth interface + AuthResult|
|Identity/AuthService.cs|bdDevCRM.Infrastructure|Login/Refresh/Revoke + token rotation|
|Data/AppDbContext.cs|bdDevCRM.Infrastructure|IdentityDbContext<AppUser> + all shared DbSets|
|Extensions/InfrastructureServiceExtensions.cs|bdDevCRM.Infrastructure|DI: DbContext+Identity+JWT+Redis|
|Controllers/AuthController.cs|bdDevCRM.API|POST /api/auth/login, /refresh, /logout|

## **Step 3 — BaseApiController + HATEOAS**

|**File**|**Project**|**Purpose**|
| :- | :- | :- |
|Contracts/Responses/LinkedResource.cs|bdDevCRM.Contracts|HATEOAS wrapper: Data + Links|
|Contracts/Interfaces/ILinkFactory.cs|bdDevCRM.Contracts|Per-entity link factory interface|
|Controllers/BaseApiController.cs|bdDevCRM.API|ToLinkedResource, ToLinkedGrid, OkResponse, NotFoundResponse|
|Swagger/SwaggerServiceExtensions.cs|bdDevCRM.API|JWT Bearer in Swagger UI|
|Hubs/NotificationHub.cs|bdDevCRM.Infrastructure|SignalR hub — user/branch groups|
|Middleware/CorrelationIdMiddleware.cs|bdDevCRM.API|X-Correlation-Id propagation|
|Middleware/ExceptionHandlingMiddleware.cs|bdDevCRM.API|Global exception → StandardApiResponse|
|Controllers/SeedController.cs|bdDevCRM.API|Dev-only admin seed endpoint|

## **Step 4 — Serilog + Middleware**

|**File**|**Project**|**Purpose**|
| :- | :- | :- |
|Application/Common/Interfaces/ICacheService.cs|bdDevCRM.Application|Cache abstraction|
|Application/Common/Behaviors/LoggingBehavior.cs|bdDevCRM.Application|MediatR request/response log|
|Application/Common/Behaviors/CachingBehavior.cs|bdDevCRM.Application|MediatR Redis cache check|
|Infrastructure/Services/RedisCacheService.cs|bdDevCRM.Infrastructure|ICacheService Redis impl|
|Infrastructure/Extensions/SerilogExtensions.cs|bdDevCRM.Infrastructure|Serilog: Console+File+MSSQL|
|API/Middleware/RequestLoggingMiddleware.cs|bdDevCRM.API|HTTP request/response timing log|

## **Step 5 — Hangfire**

|**File**|**Project**|**Purpose**|
| :- | :- | :- |
|Extensions/HangfireExtensions.cs|bdDevCRM.Infrastructure|Hangfire SQL Server + 3 queues|
|Hangfire/HangfireAuthFilter.cs|bdDevCRM.Infrastructure|Dashboard auth filter|
|Hangfire/IJobService.cs|bdDevCRM.Infrastructure|Job interface|
|Hangfire/JobService.cs|bdDevCRM.Infrastructure|IJobService implementation|
|Hangfire/Jobs/FollowUpReminderJob.cs|bdDevCRM.Infrastructure|Every 5min follow-up check|
|Hangfire/Jobs/CommunicationQueueJob.cs|bdDevCRM.Infrastructure|Every 1min email/SMS queue|
|Hangfire/RecurringJobsRegistrar.cs|bdDevCRM.Infrastructure|All recurring jobs registration|

## **Step 6 — Menu + Permission System**

|**File**|**Project**|**Purpose**|
| :- | :- | :- |
|Contracts/Responses/MenuItemDto.cs|bdDevCRM.Contracts|Menu tree DTO|
|Services/MenuService.cs|bdDevCRM.Infrastructure|Raw SQL menu tree builder|
|Services/CachedMenuService.cs|bdDevCRM.Infrastructure|Redis 30min cache wrapper|
|Services/PermissionService.cs|bdDevCRM.Infrastructure|Raw SQL permissions + 15min cache|
|Controllers/MenuController.cs|bdDevCRM.API|GET /api/menu (authorized)|
|Web/Services/WebMenuService.cs|bdDevCRM.Web|MVC menu loader via API|
|Views/Shared/\_Sidebar.cshtml|bdDevCRM.Web|Permission-filtered sidebar tree|
|wwwroot/css/sidebar.css|bdDevCRM.Web|Sidebar styles + collapse animation|
|wwwroot/js/sidebar.js|bdDevCRM.Web|Toggle, search filter, SPA loader, popstate|

## **Step 7.0 — TypeScript + esbuild**

|**File**|**Location**|**Purpose**|
| :- | :- | :- |
|package.json|bdDevCRM.Web/|npm config + build scripts|
|tsconfig.json|bdDevCRM.Web/|TypeScript compiler config|
|build.js|bdDevCRM.Web/|esbuild build script|
|ts-src/types/api.types.ts|ts-src/types/|ApiResponse<T>, PaginationMetadata, LinkDto, FieldError, GridResult<T>|
|ts-src/types/grid.types.ts|ts-src/types/|GridRequestOptions, GridSort, GridFilter, GridOperator|
|ts-src/types/theme.types.ts|ts-src/types/|ThemeFamily, ThemeMode, ThemeDensity, UserThemePreference|
|ts-src/types/ui.types.ts|ts-src/types/|ToastOptions, ModalOptions, NotificationItem|
|ts-src/core/event-bus.ts|ts-src/core/|EventBus class + Events constants|
|ts-src/core/api-service.ts|ts-src/core/|BdApiService — fetch wrapper + token mgmt + grid()|
|ts-src/bundle.ts|ts-src/|Entry point — window.bdApi, bdToast, bdLoading, bdNav|

## **Step 7.1 — App Shell Foundation**

|**File**|**Location**|**Purpose**|
| :- | :- | :- |
|ts-src/core/loading.ts|ts-src/core/|3-level loading: app skeleton, NProgress page bar, component spinner|
|ts-src/core/toast.ts|ts-src/core/|ToastService — 4 types, action button, auto-dismiss, progress bar|
|Views/Shared/\_Layout.cshtml|bdDevCRM.Web|Main layout — CSS Grid shell, boot sequence, all partials|
|Views/Shared/\_NotificationPanel.cshtml|bdDevCRM.Web|Bell drawer — notification list container|
|Views/Shared/\_CommandPalette.cshtml|bdDevCRM.Web|Ctrl+K palette container|
|Views/Shared/\_Footer.cshtml|bdDevCRM.Web|Fixed 50px footer|
|wwwroot/css/layout.css|bdDevCRM.Web|Full layout CSS: topbar, sidebar, content, footer, toast, skeleton|
|wwwroot/js/shell-init.js|bdDevCRM.Web|Boot sequence: token check, user context, sidebar toggle, shortcuts, session guard|

## **Step 7.2 — Navigation Intelligence**

|**File**|**Location**|**Purpose**|
| :- | :- | :- |
|ts-src/services/navigation-service.ts|ts-src/services/|ROUTE\_MAP, resolve(), apply(), breadcrumb render, active menu sync, dynamic route match|
|Views/Shared/\_PageHeader.cshtml|bdDevCRM.Web|Page title + icon + back button + actions area|
|Views/Templates/\_GridPageShell.cshtml|bdDevCRM.Web|Type 3 pattern: grid + form toggle shell, toolbar section, form section|
|Views/Templates/\_FormPageShell.cshtml|bdDevCRM.Web|Kendo TabStrip form + sticky footer save bar + Ctrl+S|
|wwwroot/css/components.css|bdDevCRM.Web|Page header, grid-page, form-shell, form-footer, tabstrip styles|


# **8. Key Architecture Decisions**

|**Decision**|**Choice**|**Reason**|
| :- | :- | :- |
|Response Contract|StandardApiResponse<T>|Consistent shape across all endpoints|
|HATEOAS|ILinkFactory<T> per entity|Presentation layer, not domain concern|
|Auth tokens|JWT (15min) + Refresh (7d) HttpOnly cookie|Prevents XSS on refresh token|
|Token Rotation|Yes — new refresh token on each refresh|Old token immediately invalidated|
|Password hashing|BCrypt (legacy support built-in)|Migrating from legacy encrypted passwords|
|Permission format|"Module.Resource.Action" claims|e.g. CRM.Lead.View — maps to policy name|
|DB Approach|Database-First + EF Core scaffold|Existing legacy DB schema|
|Module DB Context|Separate DbContext per module|Future microservice migration path|
|Audit logging|SaveChangesAsync override|IAuditableEntity interface auto-detect|
|Grid Backend|LINQ + EF Core queryable pipeline|Raw SQL = SQL injection risk|
|Grid fetch (frontend)|bdApi.grid() — no Kendo DataSource transport|Full control, typed, no transport magic|
|TypeScript|Full TS + esbuild (Option 1)|Type safety for all services + window globals|
|Theme persistence|Per-user DB (SettingsJson) + org default|3-layer: family + mode + density|
|Form Type 1|Kendo Window Modal — generic bdModal.open()|Caller defines size, max screen-40px|
|Form Type 2|Kendo Grid inline edit|Simple lookup tables|
|Form Type 3|Grid/Form toggle|Complex multi-tab forms|
|Mobile sidebar|Overlay mode|Backdrop + slide-in, no content push|
|Grid mobile|Row context menu + sticky columns|Phase 1B implementation|

# **9. Enterprise UI — Priority Roadmap**

|**Priority**|**Feature**|**Phase**|**Status**|
| :- | :- | :- | :- |
|🔴 NOW|App Shell (Layout + Topbar + Footer)|Step 7.1|✅ Done|
|🔴 NOW|Breadcrumb + Page Header standard|Step 7.2|✅ Done|
|🔴 NOW|Navigation Intelligence (active menu sync)|Step 7.2|✅ Done|
|🔴 NOW|Grid/Form toggle pattern (Type 3)|Step 7.2|✅ Done|
|🔴 NOW|Theme Platform (3-layer)|Step 7.3|🔄 Next|
|🔴 NOW|Global Loading / Progress (3-level)|Step 7.4|⏳|
|🔴 NOW|Toast Notification System|Step 7.4|⏳|
|🔴 NOW|Session Timeout Warning|Step 7.5|⏳|
|🔴 NOW|Form Dirty Check|Step 7.5|⏳|
|🔴 NOW|Form: auto-save draft (localStorage)|Step 7.5|⏳|
|🔴 NOW|Form: field dependency (country→city)|Step 7.5|⏳|
|🔴 NOW|Form: inline validation|Step 7.5|⏳|
|🔴 NOW|Notification Center (bell drawer)|Step 7.6|⏳|
|🔴 NOW|Command Palette (Ctrl+K)|Step 7.6|⏳|
|🔴 NOW|Generic Modal Wrapper (bd-modal.ts)|Step 7.6|⏳|
|🟡 1B|Enterprise Grid (server-side all)|Phase 1B|⏳|
|🟡 1B|Row context menu (right-click)|Phase 1B|⏳|
|🟡 1B|Sticky/frozen columns|Phase 1B|⏳|
|🟡 1B|Grid Toolbar Standard|Phase 1B|⏳|
|🟡 1B|Export (Excel/PDF/CSV)|Phase 1B|⏳|
|🟢 Ph2|Dashboard Widget System (drag-drop)|Phase 2|⏳|
|🟢 Ph2|Multi-tab workspace|Phase 2|⏳|
|🟢 Ph2|Inactivity Lock (30min)|Phase 2|⏳|
|🟢 Ph2|Saved Filter Views|Phase 2|⏳|
|🔵 Ph3+|Activity Stream per record|Phase 3+|⏳|
|🔵 Ph3+|Accessibility (ARIA, keyboard nav)|Phase 3+|⏳|

# **10. Important Patterns Reference**
## **10.1 Permission Format**

|<p>**Permission Claim Format**</p><p>Format:  "Module.Resource.Action"</p><p>Example: "CRM.Lead.View", "CRM.Lead.Create", "Admin.Role.Manage"</p><p>Usage:   [Authorize(Policy = "CRM.Lead.View")]</p><p>In JWT:  claims.Add(new Claim("permission", "CRM.Lead.View"))</p>|
| :- |

## **10.2 Grid Fetch Pattern (no DataSource transport)**

|<p>// TypeScript — in any page script</p><p>const result = await window.bdApi.grid<LeadDto>('/crm/leads/grid', {</p><p>`  `skip: 0, take: 20, page: 1, pageSize: 20,</p><p>`  `sort: [{ field: 'createdAt', dir: 'desc' }],</p><p>`  `filter: null</p><p>});</p><p>// result: { items: LeadDto[], totalCount: number }</p><p></p><p>// Kendo Grid — manual bind (no transport)</p><p>const ds = new kendo.data.DataSource({</p><p>`  `data:  result.items,</p><p>`  `total: result.totalCount,</p><p>`  `serverPaging: true,</p><p>`  `pageSize: 20</p><p>});</p><p>$("#grid").data("kendoGrid").setDataSource(ds);</p>|
| :- |

## **10.3 Form Type 3 — Grid/Form Toggle**

|<p>// Toolbar "New" button:</p><p>window.bdShowForm("New Lead");</p><p></p><p>// Inside form — after save:</p><p>window.bdFormSaving(true);</p><p>// ... save logic ...</p><p>window.bdFormSaving(false);</p><p>window.bdHideForm();   // dirty check → grid refresh</p><p></p><p>// Toast feedback:</p><p>window.bdToast.success("Lead created!", "Success",</p><p>`                        `"View Lead", "/crm/leads/123");</p>|
| :- |

## **10.4 Navigation Registration (dynamic pages)**

|<p>// In a Razor view script section:</p><p>window.bdNav.register('/crm/leads/123', {</p><p>`  `title:  'John Doe',</p><p>`  `icon:   'fa-funnel',</p><p>`  `module: 'CRM',</p><p>`  `breadcrumbs: [</p><p>`    `{ label: 'CRM',   url: '#' },</p><p>`    `{ label: 'Leads', url: '/crm/leads' },</p><p>`    `{ label: 'John Doe' }</p><p>`  `]</p><p>});</p><p>window.bdNav.apply('/crm/leads/123');</p>|
| :- |

# **11. Configuration Reference**

|**Key**|**Value / Notes**|
| :- | :- |
|ConnectionStrings:Default|Server=.;Database=bdDevCRM;Trusted\_Connection=True;TrustServerCertificate=True;|
|ConnectionStrings:Redis|localhost:6379|
|Jwt:Secret|Min 32 chars — keep in secrets.json / env var in prod|
|Jwt:Issuer|bdDevCRM|
|Jwt:Audience|bdDevCRM-clients|
|Jwt:ExpiryMinutes|15|
|ApiBaseUrl (Web)|https://localhost:5001 (API project URL)|
|esbuild build|npm run build (dev) / npm run build:prod (prod)|
|esbuild watch|npm run watch (auto-recompile on ts-src change)|

|<p>**📌 Claude-কে দেওয়ার নির্দেশনা**</p><p>নতুন session শুরু করার সময় এই document-টি Claude-কে দিন।</p><p>তারপর বলুন: "এই document পড়ো। আমরা কোন step-এ আছি এবং এখন কী করতে হবে বলো।"</p><p>Claude এই document থেকে পুরো context বুঝে সাথে সাথে সঠিক step থেকে শুরু করবে।</p><p>প্রতিটি major step শেষে নতুন updated document generate করতে বলো।</p>|
| :- |



































Production Level:\
\# bdDevCRM.Web folder-এ run করো

cd src/Presentation/bdDevCRM.Web

\# Install dependencies

npm install

\# Development build (watch mode)

npm run watch

\# Production build

npm run build:prod

