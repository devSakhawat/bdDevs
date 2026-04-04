
**bdDevs — Enterprise CRM + HR Platform**

Living Project Documentation — **REALITY CHECK Edition** ⚠️

|<p>Context Document — বাস্তব অবস্থা সহ সম্পূর্ণ বিবরণ</p><p>**Last Updated: 2026-04-04 — Project Status: 28% Complete (Foundation Done, APIs Missing)**</p>|
| :-: |

**🚨 IMPORTANT: এই document এখন বাস্তব অবস্থা প্রতিফলিত করে। পূর্ববর্তী দাবি (TypeScript, Step 7.3 complete, ইত্যাদি) সংশোধন করা হয়েছে।**


# **1. Project Snapshot**

|**Field**|**Value**|
| :- | :- |
|Project Name|bdDevs (formerly bdDevCRM)|
|Type|Enterprise CRM + HR/Payroll Platform|
|Developer|Solo Developer (devSakhawat)|
|Frontend|ASP.NET Core MVC + Kendo UI for jQuery + **Plain JavaScript ES6+**|
|Backend|Modular Monolith — Clean Architecture + CQRS (MediatR)|
|Auth|ASP.NET Core Identity + JWT Bearer Tokens|
|Database|SQL Server — Database-First + EF Core (89 tables across 2 DbContexts)|
|Cache|Redis (Session + Permission + Query cache)|
|Real-time|SignalR (NotificationHub implemented, not actively used)|
|Background Jobs|Hangfire (Setup complete, jobs commented out)|
|Deployment|Docker + Kubernetes — On-premise / VPS|
|**Frontend Reality**|**❌ NO TypeScript** — 100,000+ lines of plain JavaScript|
|Current Phase|**Phase 1B — Employee Module (Reference Implementation)**|
|Overall Progress|**28% Complete** — UI Foundation ✅, Feature APIs ❌|

# **2. Solution Structure (ACTUAL)**

**⚠️ WARNING: Previous documentation described ts-src/ folder — THIS DOES NOT EXIST**

```
bdDevs/
├── src/
│   ├── Presentation/
│   │   ├── bdDevs.Api/              ← ASP.NET Core Web API (7 controllers)
│   │   └── bdDevs.Web/              ← ASP.NET Core MVC Frontend
│   │       ├── wwwroot/
│   │       │   ├── js/              ← 100,000+ lines PLAIN JAVASCRIPT (NOT TypeScript)
│   │       │   │   ├── app.js (14k lines)
│   │       │   │   ├── shell-init.js (8k lines)
│   │       │   │   ├── sidebar.js (10k lines)
│   │       │   │   ├── theme-switcher.js (9k lines)
│   │       │   │   ├── notification-center.js (13k lines)
│   │       │   │   ├── command-palette.js (17k lines)
│   │       │   │   ├── grid-base.js (19k lines)
│   │       │   │   ├── bd-modal.js (11k lines)
│   │       │   │   ├── form-guard.js (11k lines)
│   │       │   │   └── modules/
│   │       │   │       └── Core/
│   │       │   │           ├── employee.js (21k lines) ← Reference module
│   │       │   │           ├── menu-management.js (10k lines)
│   │       │   │           ├── api.js (7k lines)
│   │       │   │           └── grid-base.js (9k lines)
│   │       │   ├── css/             ← Professional design system
│   │       │   │   ├── design-tokens.css ← ✅ Created
│   │       │   │   ├── design-system.css ← ✅ Created
│   │       │   │   ├── layout.css
│   │       │   │   ├── sidebar.css
│   │       │   │   ├── themes.css
│   │       │   │   └── components.css
│   │       │   └── lib/             ← Kendo UI jQuery + 20+ themes
│   │       └── Views/
│   │           ├── Shared/          ← Layout components
│   │           │   ├── _Layout.cshtml
│   │           │   ├── _Topbar.cshtml
│   │           │   ├── _Sidebar.cshtml
│   │           │   ├── _Footer.cshtml
│   │           │   ├── _Breadcrumb.cshtml
│   │           │   ├── _PageHeader.cshtml
│   │           │   ├── _NotificationPanel.cshtml
│   │           │   ├── _CommandPalette.cshtml
│   │           │   └── _EmptyState.cshtml ← ✅ Created
│   │           ├── Templates/
│   │           │   ├── _GridPageShell.cshtml
│   │           │   └── _GridPageShell_2.cshtml (duplicate, needs cleanup)
│   │           ├── Employee/        ← View exists, NO API
│   │           ├── Leads/           ← View exists, NO API
│   │           ├── MenuManagement/  ← ✅ Full CRUD working
│   │           └── Home/
│   ├── Modules/
│   │   ├── Modules.CRM/             ← 35 DbSets (database exists, NO APIs)
│   │   └── Modules.TokenService/
│   ├── SharedKernel/
│   │   ├── bdDevs.Domain/           ← 54 entities
│   │   ├── bdDevs.Application/      ← CQRS infrastructure + Menu feature ONLY
│   │   └── bdDevs.Infrastructure/   ← Services, Identity, Caching, Hangfire
│   └── CrossCutting/
│       ├── bdDevs.Common/
│       └── bdDevs.Contracts/
└── tests/
    ├── Unit/bdDevsTests/            ← 2 test files only
    └── Integration/bdDevs.IntegrationTests/
```

# **3. Frontend JavaScript Architecture (ACTUAL — NO TypeScript)**

**🚨 CRITICAL CORRECTION:** Previous Living Doc claimed TypeScript + esbuild setup. **THIS IS FALSE.**

## **Reality:**
- **NO TypeScript compiler** — package.json only has `@microsoft/signalr` dependency
- **NO ts-src/ folder** — Does not exist
- **NO build process** — No npm build scripts, no esbuild, no compilation
- **100% Plain JavaScript ES6+** — All code is in wwwroot/js/ (no transpilation)

|**Component**|**File**|**Size**|**Status**|
| :- | :- | :- | :- |
|**Core App**|app.js|14,365 lines|✅ Working|
|**Shell Init**|shell-init.js|8,443 lines|✅ Working|
|**Sidebar**|sidebar.js|10,266 lines|✅ Dynamic menu with permission filtering|
|**Theme System**|theme-switcher.js|8,920 lines|✅ 20+ themes with API persistence|
|**Notifications**|notification-center.js|13,461 lines|✅ SignalR ready|
|**Command Palette**|command-palette.js|16,829 lines|✅ Ctrl+K search|
|**Grid Base**|grid-base.js|18,752 lines|✅ Kendo Grid utilities|
|**Modal**|bd-modal.js|11,186 lines|✅ Kendo Window wrapper|
|**Form Guard**|form-guard.js|10,632 lines|✅ Dirty check|
|**Session Guard**|session-guard.js|7,999 lines|✅ Auto-logout|
|**Loading**|loading.js|7,975 lines|✅ 3-level loading states|
|**Toast**|toast.js|3,574 lines|✅ 4 toast types|
|**Employee Module**|modules/Core/employee.js|21,146 lines|⚠️ UI only, NO API|
|**Menu Module**|modules/Core/menu-management.js|9,811 lines|✅ Full CRUD with API|
|**API Service**|modules/Core/api.js|7,069 lines|✅ Fetch wrapper|
|**Total**||**~170,000 lines**|**Plain JavaScript ES6+**|

## **Window Globals (Exposed by app.js)**
```javascript
window.bdApi       → API service (HTTP fetch, grid pagination)
window.bdToast     → Toast notifications
window.bdLoading   → Loading states (app/page/component)
window.bdNav       → Navigation & breadcrumb
window.bdTheme     → Theme switching
window.bdModal     → Modal dialogs
window.eventBus    → Internal pub/sub events
```

## **Decision: TypeScript Migration Status**
- **Original Plan:** Migrate all JS to TypeScript with esbuild
- **Current Status:** ❌ NOT STARTED (claimed "done" in old Living Doc, FALSE)
- **New Decision:** **DEFER INDEFINITELY** — Focus on business features instead
- **Rationale:** 170k lines of working JS, solo developer, negative ROI

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

# **5. Implementation Progress — REALITY CHECK**

## **✅ COMPLETED (Working Features)**

### **Authentication & Security (85% Complete)**
- ✅ JWT with refresh token rotation
- ✅ AuthController API (Login/Refresh/Logout)
- ✅ Session timeout detection
- ✅ Cookie-based refresh tokens (HttpOnly)
- ❌ Missing: Login UI (using API directly for now)

### **Menu System (95% Complete)**
- ✅ Full CRUD API (CQRS with MediatR)
- ✅ Menu hierarchy support
- ✅ Permission-based filtering
- ✅ Dynamic sidebar rendering
- ✅ Admin UI for menu management
- ✅ Redis caching (30min TTL)

### **Theme System (85% Complete)**
- ✅ 20+ Kendo UI themes
- ✅ Theme switching API with DB persistence
- ✅ UserPreferenceController
- ✅ Cookie + localStorage fallback
- ✅ theme-switcher.js (8,920 lines)

### **UI Framework (70% Complete)**
- ✅ Design tokens (spacing, typography, colors, shadows, radius)
- ✅ Design system CSS (buttons, cards, badges)
- ✅ Grid-based responsive layout
- ✅ Sidebar (collapsible, mobile overlay)
- ✅ Breadcrumb navigation
- ✅ Toast notifications (4 types)
- ✅ Loading states (app/page/component levels)
- ✅ Modal wrapper (Kendo Window)
- ✅ Form guard (dirty check)
- ✅ Command palette (Ctrl+K)
- ✅ Notification center (SignalR ready)
- ✅ Empty state component
- ⏳ Grid context menu (right-click)
- ⏳ Enhanced form validation visuals

### **Infrastructure (75% Complete)**
- ✅ Clean Architecture setup
- ✅ CQRS + MediatR pipeline
- ✅ Redis caching service
- ✅ Serilog logging (Console + File + MSSQL)
- ✅ Global exception handling
- ✅ Correlation ID middleware
- ✅ Request logging middleware
- ✅ Hangfire setup (jobs commented out)
- ✅ SignalR NotificationHub (not actively used)

## **⚠️ PARTIALLY IMPLEMENTED (UI Exists, NO API)**

### **Employee Module (30% Complete)**
- ✅ Employee view with Kendo Grid
- ✅ Employee modal form template
- ✅ employee.js (21,146 lines of frontend code)
- ❌ NO Employee API endpoints
- ❌ NO CQRS commands/queries
- ❌ NO database integration

### **Leads Module (15% Complete)**
- ✅ Leads view using grid template
- ❌ NO Leads API
- ❌ NO frontend JavaScript module
- ✅ CRM database schema exists (35 tables in CrmDbContext)

## **❌ NOT IMPLEMENTED (Despite Database Existing)**

### **CRM Module (Database: 90%, API: 0%, UI: 10%)**
**Database Tables Exist:** 35 CRM tables in Modules.CRM
- CrmApplicantInfos, CrmApplications, CrmCourses, CrmInstitutes
- CrmCountries, CrmEducationHistories, CrmWorkExperiences, etc.

**Missing:**
- ❌ All CRM API controllers
- ❌ All CQRS commands/queries
- ❌ Student management UI
- ❌ Application processing UI
- ❌ Course/Institute management UI

### **HR Module (0% Complete)**
- ❌ No HR controllers
- ❌ No HR API endpoints
- ❌ No HR views (except Employee placeholder)

### **Payroll Module (0% Complete)**
- ❌ Completely missing

### **Attendance Module (0% Complete)**
- ❌ Completely missing

### **Reporting Module (0% Complete)**
- ❌ Completely missing

### **Admin Module (Backend: 60%, Frontend: 5%)**
- ✅ PermissionService (permission checking)
- ✅ User/Role database tables
- ❌ User management UI
- ❌ Role management UI
- ❌ Permission assignment UI

## **Overall Progress Summary**

|Category|Database|Backend API|Frontend UI|Overall|
| :- | :- | :- | :- | :- |
|**Auth & Security**|100%|90%|60%|85%|
|**Menu System**|100%|100%|90%|95%|
|**Theme System**|100%|90%|75%|85%|
|**UI Framework**|N/A|N/A|70%|70%|
|**Infrastructure**|N/A|75%|N/A|75%|
|**Employee**|100%|0%|30%|30%|
|**CRM (Leads/Students/Apps)**|90%|0%|10%|20%|
|**HR**|50%|0%|0%|10%|
|**Payroll**|0%|0%|0%|0%|
|**Attendance**|0%|0%|0%|0%|
|**Reporting**|0%|0%|0%|0%|
|**OVERALL PROJECT**|||**~28%**|

**Conclusion:** Strong foundation (infrastructure, auth, UI framework), but **business features are mostly missing**. Database schema exists but APIs are not implemented.

---

# **6. NEXT STEPS — Priority Roadmap**

## **🔴 IMMEDIATE PRIORITY: Employee Module as Reference Implementation**

**Goal:** Complete Employee module end-to-end as **reference pattern** for all future modules

### **Phase 1B: Employee Module API (Current Focus)**

|Step|Task|Deliverable|
| :- | :- | :- |
|1B.1|Create Employee CQRS structure|CreateEmployeeCommand, UpdateEmployeeCommand, DeleteEmployeeCommand, GetEmployeeQuery, GetEmployeeGridQuery|
|1B.2|Implement Employee validators|FluentValidation rules for all commands|
|1B.3|Create Employee API controller|/api/employee endpoints (GET, POST, PUT, DELETE, /grid)|
|1B.4|Wire employee.js to API|Replace mock data, test full CRUD workflow|
|1B.5|Add permission checks|Authorize policies on Employee endpoints|
|1B.6|Test & document|Full CRUD test, document as reference pattern|

**Why Employee First?**
- Frontend exists (21k lines of employee.js)
- UI patterns already established
- Once complete, becomes **copy-paste template** for:
  - Lead module
  - Student module
  - Application module
  - All other modules

## **🟡 PHASE 1C: CRM Lead Module (After Employee Complete)**

|Step|Task|
| :- | :- |
|1C.1|Copy Employee CQRS pattern → Lead|
|1C.2|Create Lead API controller|
|1C.3|Implement leads.js (copy employee.js structure)|
|1C.4|Add Lead Activities (timeline feature)|
|1C.5|Add Lead Assignment (round-robin)|
|1C.6|Add Lead→Student conversion|

## **🟢 PHASE 2: Remaining CRM Features**
- Student module
- Application module
- Course/Institute management
- Document management

## **🔵 PHASE 3: HR & Payroll**
- HR Employee full features
- Payroll processing
- Attendance tracking

## **⚪ DEFERRED: TypeScript Migration**
- **Decision:** Stay with JavaScript
- **Reason:** 170k lines working, solo developer, negative ROI
- **Alternative:** Use TypeScript for NEW modules only (optional)

---

# **7. Configuration Reference**
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

