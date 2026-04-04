# bdDevs Enterprise Architecture Design Document
## Modular Monolith with 30+ Modules - Complete Blueprint

**Date:** 2026-04-04
**Version:** 2.0
**Target:** 30+ Modules, 1000+ Tables, Enterprise-Level Application

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Module Structure Standard](#3-module-structure-standard)
4. [Database Strategy](#4-database-strategy)
5. [Grid Infrastructure](#5-grid-infrastructure)
6. [Cross-Module Communication](#6-cross-module-communication)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Project Vision

**bdDevs** হবে একটি **Modular Monolith** architecture যেখানে:
- ৩০+ independent modules (CRM, HR, Accounting, Inventory, etc.)
- ১০০০+ database tables (প্রতি module এ আলাদা database)
- Enterprise-level scalability and maintainability
- Single codebase কিন্তু module-level isolation

### 1.2 Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture Pattern** | Modular Monolith | Simpler than microservices, easier to develop/deploy, can extract to microservices later |
| **Database Strategy** | Database-per-Module | Isolation, independent scaling, clear boundaries |
| **Grid Mechanism** | Hybrid (LINQ + SQL) | LINQ for 80% (simple), SQL for 20% (performance-critical) |
| **Front-End** | Server-side MVC + Kendo jQuery | No build complexity, proven stable, large team can work |
| **Module Communication** | Domain Events (MediatR) | Loose coupling, async processing, scalable |
| **Deployment** | Single deployment unit initially | Fast deployment, can split later if needed |

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                    │
├──────────────────────────┬──────────────────────────────────┤
│  bdDevs.Web (MVC)        │  bdDevs.Api (REST API)           │
│  - Razor Views           │  - Controllers                   │
│  - JavaScript (170k LOC) │  - API Versioning                │
│  - Kendo UI jQuery       │  - Swagger/OpenAPI               │
└──────────────────────────┴──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                       MODULES (30+)                          │
├──────────────────────────────────────────────────────────────┤
│  Modules.CRM             │  Modules.HR                       │
│  - Leads, Students       │  - Employees, Attendance          │
│  - Applications          │  - Payroll, Leave                 │
│  - CrmDbContext          │  - HrDbContext                    │
├──────────────────────────┼──────────────────────────────────┤
│  Modules.Accounting      │  Modules.Inventory                │
│  - Invoices, Payments    │  - Products, Stock                │
│  - Ledger                │  - Warehouses                     │
│  - AccountingDbContext   │  - InventoryDbContext             │
├──────────────────────────┴──────────────────────────────────┤
│                    ... 26+ More Modules                      │
└──────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                      SHARED KERNEL                           │
├──────────────────────────────────────────────────────────────┤
│  Domain              Application            Infrastructure   │
│  - Base Entities     - CQRS Pattern         - CoreDbContext  │
│  - Value Objects     - MediatR Pipeline     - Auth Service   │
│  - Domain Events     - Grid Services        - Cache Service  │
│                      - Validation           - Email Service  │
└──────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                       DATABASES (30+)                        │
├──────────────────────────────────────────────────────────────┤
│  bdDevs_Core         bdDevs_CRM         bdDevs_HR           │
│  - Users             - Leads            - Employees         │
│  - Roles             - Students         - Attendance        │
│  - Permissions       - Applications     - Payroll           │
│  - Menus             (35 tables)        (40 tables)         │
│  (54 tables)                                                 │
├──────────────────────────────────────────────────────────────┤
│  bdDevs_Accounting   bdDevs_Inventory   ... (26+ more)      │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Module Boundaries

প্রতিটি module নিজের মধ্যে একটি **mini application**:

```
Module Structure:
├── API/              (Controllers - HTTP endpoints)
├── Application/      (CQRS - Commands/Queries)
├── Domain/           (Entities, Value Objects, Business Rules)
├── Infrastructure/   (DbContext, Repositories, External Services)
└── Contracts/        (DTOs, Request/Response models)
```

**Key Principles:**
- ✅ Each module has its own database
- ✅ Modules communicate via Domain Events (not direct DB access)
- ✅ Modules can't reference each other's internal code
- ✅ Modules share only contracts (interfaces/DTOs)

---

## 3. Module Structure Standard

### 3.1 Module Folder Structure (Template)

```
src/Modules/Modules.{ModuleName}/
├── API/
│   └── Controllers/
│       ├── {Entity}Controller.cs
│       └── BaseModuleController.cs
│
├── Application/
│   ├── Features/
│   │   └── {Entity}/
│   │       ├── Commands/
│   │       │   ├── Create{Entity}Command.cs
│   │       │   ├── Create{Entity}CommandHandler.cs
│   │       │   ├── Create{Entity}CommandValidator.cs
│   │       │   ├── Update{Entity}Command.cs
│   │       │   ├── Update{Entity}CommandHandler.cs
│   │       │   ├── Update{Entity}CommandValidator.cs
│   │       │   ├── Delete{Entity}Command.cs
│   │       │   └── Delete{Entity}CommandHandler.cs
│   │       └── Queries/
│   │           ├── GetAll{Entity}Query.cs
│   │           ├── GetAll{Entity}QueryHandler.cs
│   │           ├── Get{Entity}ByIdQuery.cs
│   │           ├── Get{Entity}ByIdQueryHandler.cs
│   │           ├── Get{Entity}GridQuery.cs        ← Grid query!
│   │           └── Get{Entity}GridQueryHandler.cs
│   │
│   ├── DTOs/
│   │   ├── {Entity}Dto.cs
│   │   ├── Create{Entity}Request.cs
│   │   └── Update{Entity}Request.cs
│   │
│   ├── Mappings/
│   │   └── {Entity}Profile.cs (AutoMapper)
│   │
│   └── Events/
│       ├── {Entity}CreatedEvent.cs
│       ├── {Entity}UpdatedEvent.cs
│       └── {Entity}DeletedEvent.cs
│
├── Domain/
│   ├── Entities/
│   │   └── {Entity}.cs
│   │
│   ├── ValueObjects/
│   │   └── {EntityName}.cs
│   │
│   ├── Enums/
│   │   └── {Entity}Status.cs
│   │
│   └── Specifications/
│       └── {Entity}Specifications.cs
│
├── Infrastructure/
│   ├── Data/
│   │   ├── {Module}DbContext.cs
│   │   ├── Configurations/
│   │   │   └── {Entity}Configuration.cs
│   │   └── Migrations/
│   │
│   ├── Repositories/
│   │   └── {Entity}Repository.cs (if needed)
│   │
│   └── Services/
│       └── {Module}BackgroundService.cs (if needed)
│
├── {ModuleName}ServiceRegistration.cs  ← DI registration
└── Modules.{ModuleName}.csproj
```

### 3.2 Example: CRM Module Structure

```
src/Modules/Modules.CRM/
├── API/
│   └── Controllers/
│       ├── LeadController.cs
│       ├── StudentController.cs
│       └── ApplicationController.cs
│
├── Application/
│   ├── Features/
│   │   ├── Leads/
│   │   │   ├── Commands/
│   │   │   │   ├── CreateLeadCommand.cs
│   │   │   │   ├── CreateLeadCommandHandler.cs
│   │   │   │   ├── CreateLeadCommandValidator.cs
│   │   │   │   ├── UpdateLeadCommand.cs
│   │   │   │   ├── UpdateLeadCommandHandler.cs
│   │   │   │   ├── DeleteLeadCommand.cs
│   │   │   │   └── DeleteLeadCommandHandler.cs
│   │   │   └── Queries/
│   │   │       ├── GetLeadsGridQuery.cs          ← Uses LinqGridService
│   │   │       ├── GetLeadsGridQueryHandler.cs
│   │   │       ├── GetLeadByIdQuery.cs
│   │   │       └── GetLeadByIdQueryHandler.cs
│   │   │
│   │   ├── Students/
│   │   │   ├── Commands/ (similar structure)
│   │   │   └── Queries/
│   │   │
│   │   └── Applications/
│   │       ├── Commands/
│   │       └── Queries/
│   │
│   ├── DTOs/
│   │   ├── LeadDto.cs
│   │   ├── CreateLeadRequest.cs
│   │   ├── UpdateLeadRequest.cs
│   │   ├── StudentDto.cs
│   │   └── ApplicationDto.cs
│   │
│   └── Events/
│       ├── LeadCreatedEvent.cs
│       ├── LeadConvertedToStudentEvent.cs  ← Cross-entity event
│       └── ApplicationSubmittedEvent.cs
│
├── Domain/
│   ├── Entities/
│   │   ├── Lead.cs
│   │   ├── Student.cs
│   │   └── Application.cs
│   │
│   └── Enums/
│       ├── LeadStatus.cs
│       ├── StudentStatus.cs
│       └── ApplicationStatus.cs
│
├── Infrastructure/
│   ├── Data/
│   │   ├── CrmDbContext.cs
│   │   └── Configurations/
│   │       ├── LeadConfiguration.cs
│   │       ├── StudentConfiguration.cs
│   │       └── ApplicationConfiguration.cs
│
└── CrmServiceRegistration.cs
```

### 3.3 Service Registration Pattern

**File:** `Modules.CRM/CrmServiceRegistration.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Modules.CRM;

public static class CrmServiceRegistration
{
    public static IServiceCollection AddCrmModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register DbContext
        services.AddDbContext<CrmDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("CrmDatabase")
            ));

        // Register MediatR handlers (auto-discovery)
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(
            typeof(CrmServiceRegistration).Assembly
        ));

        // Register AutoMapper profiles
        services.AddAutoMapper(typeof(CrmServiceRegistration).Assembly);

        // Register module-specific services
        // services.AddScoped<ILeadService, LeadService>();

        return services;
    }
}
```

**Usage in Program.cs:**
```csharp
// Register modules
builder.Services.AddCrmModule(builder.Configuration);
builder.Services.AddHrModule(builder.Configuration);
builder.Services.AddAccountingModule(builder.Configuration);
// ... 27+ more modules
```

---

## 4. Database Strategy

### 4.1 Database-per-Module Pattern

**Why?**
- ✅ **Isolation:** CRM failure doesn't affect HR
- ✅ **Scalability:** Each database can be on different server
- ✅ **Clear Boundaries:** Prevents direct cross-module queries
- ✅ **Independent Deployment:** Update CRM schema without touching HR
- ✅ **Team Autonomy:** CRM team owns CRM database

**Trade-offs:**
- ⚠️ **No Foreign Keys** across databases
- ⚠️ **No Transactions** across modules (use Saga pattern)
- ⚠️ **Data Consistency:** Eventual consistency via events

### 4.2 Database Naming Convention

```
bdDevs_Core             (shared: users, roles, permissions, menus)
bdDevs_CRM              (leads, students, applications)
bdDevs_HR               (employees, attendance, payroll)
bdDevs_Accounting       (invoices, payments, ledger)
bdDevs_Inventory        (products, stock, warehouses)
bdDevs_Sales            (orders, customers, quotes)
bdDevs_Marketing        (campaigns, emails, analytics)
bdDevs_Support          (tickets, knowledge base)
bdDevs_Finance          (budgets, forecasts, reports)
bdDevs_Procurement      (purchase orders, vendors)
... (20+ more modules)
```

### 4.3 Connection String Configuration

**appsettings.json:**
```json
{
  "ConnectionStrings": {
    "CoreDatabase": "Server=.;Database=bdDevs_Core;Trusted_Connection=true;",
    "CrmDatabase": "Server=.;Database=bdDevs_CRM;Trusted_Connection=true;",
    "HrDatabase": "Server=.;Database=bdDevs_HR;Trusted_Connection=true;",
    "AccountingDatabase": "Server=.;Database=bdDevs_Accounting;Trusted_Connection=true;"
  }
}
```

**appsettings.Production.json:**
```json
{
  "ConnectionStrings": {
    "CoreDatabase": "Server=db-core.bddevs.com;Database=bdDevs_Core;...",
    "CrmDatabase": "Server=db-crm.bddevs.com;Database=bdDevs_CRM;...",
    "HrDatabase": "Server=db-hr.bddevs.com;Database=bdDevs_HR;...",
    "AccountingDatabase": "Server=db-accounting.bddevs.com;Database=bdDevs_Accounting;..."
  }
}
```

**Scalability:** প্রতিটি database আলাদা server এ রাখা যাবে!

### 4.4 DbContext Structure

**Core DbContext (Shared):**
```csharp
public class CoreDbContext : DbContext
{
    public CoreDbContext(DbContextOptions<CoreDbContext> options)
        : base(options) { }

    // Identity
    public DbSet<AppUser> Users { get; set; }
    public DbSet<AppRole> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }

    // Common
    public DbSet<Menu> Menus { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Setting> Settings { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema("Core");
        builder.ApplyConfigurationsFromAssembly(typeof(CoreDbContext).Assembly);
    }
}
```

**CRM DbContext (Module-specific):**
```csharp
public class CrmDbContext : DbContext
{
    public CrmDbContext(DbContextOptions<CrmDbContext> options)
        : base(options) { }

    // CRM Entities
    public DbSet<Lead> Leads { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Agent> Agents { get; set; }
    public DbSet<Commission> Commissions { get; set; }
    // ... 30+ more entities

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema("CRM");
        builder.ApplyConfigurationsFromAssembly(typeof(CrmDbContext).Assembly);
    }
}
```

### 4.5 Migration Strategy

**Each module has its own migrations:**

```bash
# CRM Module Migrations
dotnet ef migrations add InitialCreate --context CrmDbContext --output-dir Infrastructure/Data/Migrations
dotnet ef database update --context CrmDbContext

# HR Module Migrations
dotnet ef migrations add InitialCreate --context HrDbContext --output-dir Infrastructure/Data/Migrations
dotnet ef database update --context HrDbContext

# Independent updates
dotnet ef migrations add AddLeadSourceField --context CrmDbContext
dotnet ef database update --context CrmDbContext
# ← HR database is not affected!
```

---

## 5. Grid Infrastructure

### 5.1 Shared Grid Services (SharedKernel)

```
SharedKernel/
└── Application/
    └── Common/
        └── Grid/
            ├── IGridService.cs
            ├── LinqGridService.cs       ← Default (80% of grids)
            ├── SqlGridService.cs        ← Advanced (20% of grids)
            ├── GridRequest.cs
            ├── GridResponse.cs
            ├── GridSort.cs
            └── GridFilterGroup.cs
```

### 5.2 Grid Request/Response Models

**GridRequest.cs:**
```csharp
namespace bdDevs.Application.Common.Grid;

public class GridRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public int Skip => (Page - 1) * PageSize;

    public string? Search { get; set; }
    public List<GridSort>? Sort { get; set; }
    public GridFilterGroup? Filter { get; set; }
}

public class GridSort
{
    public string Field { get; set; } = string.Empty;
    public string Direction { get; set; } = "asc";
}

public class GridFilterGroup
{
    public string Logic { get; set; } = "and";
    public List<GridFilterCondition> Filters { get; set; } = new();
}

public class GridFilterCondition
{
    public string Field { get; set; } = string.Empty;
    public string Operator { get; set; } = "eq";
    public string? Value { get; set; }
}
```

**GridResponse.cs:**
```csharp
namespace bdDevs.Application.Common.Grid;

public class GridResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(Total / (double)PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
```

### 5.3 LinqGridService (Default)

```csharp
namespace bdDevs.Application.Common.Grid;

public class LinqGridService
{
    public async Task<GridResponse<TDto>> GetGridDataAsync<TEntity, TDto>(
        IQueryable<TEntity> baseQuery,
        GridRequest request,
        Expression<Func<TEntity, TDto>> selector,
        CancellationToken ct = default)
    {
        // 1. Apply search (if provided)
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            baseQuery = ApplySearch(baseQuery, request.Search);
        }

        // 2. Apply filters (if provided)
        if (request.Filter != null)
        {
            baseQuery = ApplyFilters(baseQuery, request.Filter);
        }

        // 3. Get total count BEFORE pagination
        var total = await baseQuery.CountAsync(ct);

        // 4. Apply sorting
        baseQuery = ApplySorting(baseQuery, request.Sort);

        // 5. Apply pagination
        var data = await baseQuery
            .Skip(request.Skip)
            .Take(request.PageSize)
            .Select(selector)
            .ToListAsync(ct);

        return new GridResponse<TDto>
        {
            Data = data,
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    // Implementation of ApplySearch, ApplyFilters, ApplySorting
    // ... (see GRID_MECHANISM_COMPARISON_AND_RECOMMENDATION.md)
}
```

### 5.4 Usage Example in Query Handler

```csharp
public class GetLeadsGridQueryHandler : IRequestHandler<GetLeadsGridQuery, GridResponse<LeadDto>>
{
    private readonly CrmDbContext _context;
    private readonly LinqGridService _gridService;

    public GetLeadsGridQueryHandler(CrmDbContext context, LinqGridService gridService)
    {
        _context = context;
        _gridService = gridService;
    }

    public async Task<GridResponse<LeadDto>> Handle(GetLeadsGridQuery request, CancellationToken ct)
    {
        // Base query (can include filters, joins, etc.)
        var baseQuery = _context.Leads
            .Where(l => l.IsDeleted == false); // Soft delete filter

        // Delegate to grid service
        return await _gridService.GetGridDataAsync(
            baseQuery,
            request.GridRequest,
            lead => new LeadDto
            {
                Id = lead.Id,
                FullName = lead.FullName,
                Email = lead.Email,
                Phone = lead.Phone,
                Status = lead.Status,
                CreatedAt = lead.CreatedAt
            },
            ct
        );
    }
}
```

**Controller:**
```csharp
[HttpPost("grid")]
public async Task<IActionResult> GetLeadsGrid([FromBody] GridRequest request)
{
    var query = new GetLeadsGridQuery { GridRequest = request };
    var result = await Mediator.Send(query);
    return Ok(result);
}
```

---

## 6. Cross-Module Communication

### 6.1 Domain Events Pattern

**Why Domain Events?**
- ✅ **Loose Coupling:** Modules don't directly reference each other
- ✅ **Scalability:** Events can be processed async
- ✅ **Audit Trail:** All important actions are events
- ✅ **Future-proof:** Easy to move to message broker (RabbitMQ, Azure Service Bus)

### 6.2 Event Flow

```
CRM Module (Publisher)
    ↓ Lead created
    ↓ Publish: LeadCreatedEvent
MediatR Event Bus
    ↓ Notify all handlers
HR Module (Subscriber)
    ↓ LeadCreatedEventHandler
    ↓ Create employee record if lead is internal

Accounting Module (Subscriber)
    ↓ LeadCreatedEventHandler
    ↓ Create potential customer account

Notification Module (Subscriber)
    ↓ LeadCreatedEventHandler
    ↓ Send welcome email
```

### 6.3 Domain Event Implementation

**Base Event:**
```csharp
namespace bdDevs.Domain.Common;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
    Guid EventId { get; }
}

public abstract class DomainEvent : IDomainEvent
{
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
    public Guid EventId { get; } = Guid.NewGuid();
}
```

**Example Event:**
```csharp
namespace Modules.CRM.Application.Events;

public class LeadConvertedToStudentEvent : DomainEvent
{
    public int LeadId { get; set; }
    public int StudentId { get; set; }
    public string StudentFullName { get; set; }
    public string Email { get; set; }
    public int ConvertedByUserId { get; set; }
}
```

**Publishing Event:**
```csharp
public class ConvertLeadToStudentCommandHandler : IRequestHandler<ConvertLeadToStudentCommand, int>
{
    private readonly CrmDbContext _context;
    private readonly IMediator _mediator;

    public async Task<int> Handle(ConvertLeadToStudentCommand request, CancellationToken ct)
    {
        // 1. Get lead
        var lead = await _context.Leads.FindAsync(request.LeadId);

        // 2. Create student
        var student = new Student
        {
            FullName = lead.FullName,
            Email = lead.Email,
            // ... copy data
        };
        _context.Students.Add(student);

        // 3. Mark lead as converted
        lead.Status = LeadStatus.Converted;
        lead.ConvertedToStudentId = student.Id;

        await _context.SaveChangesAsync(ct);

        // 4. Publish event
        await _mediator.Publish(new LeadConvertedToStudentEvent
        {
            LeadId = lead.Id,
            StudentId = student.Id,
            StudentFullName = student.FullName,
            Email = student.Email,
            ConvertedByUserId = request.UserId
        }, ct);

        return student.Id;
    }
}
```

**Event Handlers (can be in different modules):**

**Handler 1: Update Accounting (different module)**
```csharp
namespace Modules.Accounting.Application.EventHandlers;

public class LeadConvertedToStudentEventHandler : INotificationHandler<LeadConvertedToStudentEvent>
{
    private readonly AccountingDbContext _context;

    public async Task Handle(LeadConvertedToStudentEvent notification, CancellationToken ct)
    {
        // Create customer account in accounting system
        var customer = new Customer
        {
            FullName = notification.StudentFullName,
            Email = notification.Email,
            CustomerType = CustomerType.Student,
            ReferenceId = notification.StudentId.ToString(),
            ReferenceModule = "CRM"
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(ct);
    }
}
```

**Handler 2: Send Notification (different module)**
```csharp
namespace Modules.Notification.Application.EventHandlers;

public class LeadConvertedNotificationHandler : INotificationHandler<LeadConvertedToStudentEvent>
{
    private readonly IEmailService _emailService;

    public async Task Handle(LeadConvertedToStudentEvent notification, CancellationToken ct)
    {
        // Send welcome email to new student
        await _emailService.SendAsync(new EmailMessage
        {
            To = notification.Email,
            Subject = "Welcome to bdDevs CRM",
            Body = $"Dear {notification.StudentFullName}, welcome to our system..."
        });
    }
}
```

### 6.4 Event Sourcing (Optional - Phase 2)

**Store all events for audit trail:**
```csharp
public class DomainEventLog
{
    public Guid EventId { get; set; }
    public string EventType { get; set; }
    public string Payload { get; set; } // JSON
    public DateTime OccurredOn { get; set; }
    public string UserId { get; set; }
    public string ModuleName { get; set; }
}

// Store every event
public class DomainEventLogger : INotificationHandler<IDomainEvent>
{
    private readonly CoreDbContext _context;

    public async Task Handle(IDomainEvent notification, CancellationToken ct)
    {
        var log = new DomainEventLog
        {
            EventId = notification.EventId,
            EventType = notification.GetType().Name,
            Payload = JsonSerializer.Serialize(notification),
            OccurredOn = notification.OccurredOn
        };

        _context.DomainEventLogs.Add(log);
        await _context.SaveChangesAsync(ct);
    }
}
```

---

## 7. Deployment Architecture

### 7.1 Single Deployment (Phase 1)

```
┌────────────────────────────────────────────────┐
│              IIS / Azure App Service            │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  bdDevs.Web + bdDevs.Api                 │  │
│  │  (Single deployment package)             │  │
│  │                                          │  │
│  │  - All 30+ modules compiled into DLL    │  │
│  │  - Module DI registration at startup    │  │
│  │  - Single appsettings.json              │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
   ┌────▼────┐               ┌──────▼──────┐
   │ DB-Core │               │   DB-CRM    │
   │ DB-HR   │               │ DB-Account  │
   └─────────┘               └─────────────┘
```

**Advantages:**
- ✅ Simple deployment (single publish)
- ✅ No network latency between modules
- ✅ Shared memory (faster)
- ✅ Easy debugging

**Disadvantages:**
- ⚠️ All modules scale together
- ⚠️ One module crash = whole app crash

### 7.2 Independent Services (Phase 2 - Future)

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  CRM Service    │   │  HR Service     │   │ Accounting Srv  │
│  (API only)     │   │  (API only)     │   │  (API only)     │
│                 │   │                 │   │                 │
│  DB: CRM        │   │  DB: HR         │   │  DB: Accounting │
└─────────────────┘   └─────────────────┘   └─────────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Gateway     │
                    │  (YARP / Ocelot)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Web Frontend    │
                    │   (bdDevs.Web)    │
                    └───────────────────┘
```

**Migration Path:**
1. Start with Modular Monolith (easier development)
2. Identify performance bottlenecks (e.g., CRM module slow)
3. Extract that module to separate service
4. Repeat for other modules as needed
5. Eventually: Full microservices (if beneficial)

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] **Week 1:** Grid Infrastructure
  - [ ] Create `GridRequest`, `GridResponse` models
  - [ ] Implement `LinqGridService`
  - [ ] Implement `SqlGridService` (optional)
  - [ ] Unit tests for grid services
  - [ ] Update Menu controller to use grid service

- [ ] **Week 2:** Module Template
  - [ ] Create module structure template
  - [ ] Refactor Menu module to follow template
  - [ ] Create module generation script (optional)
  - [ ] Documentation: "How to Create a New Module"

### Phase 2: Proof of Concept (Weeks 3-4)
- [ ] **Week 3:** Complete 3 Modules
  - [ ] **Menu Module:** Refactor to template (already 80% done)
  - [ ] **Employee Module:** Complete CQRS + Grid (backend missing)
  - [ ] **Lead Module:** Complete CQRS + Grid (new implementation)

- [ ] **Week 4:** Cross-Module Communication
  - [ ] Domain Events infrastructure
  - [ ] Implement: Lead → Student conversion event
  - [ ] Accounting handler: Create customer on lead conversion
  - [ ] Notification handler: Send email on lead conversion

### Phase 3: Consolidation (Weeks 5-6)
- [ ] **Week 5:** Database Strategy
  - [ ] Consolidate CoreDbContext + CrmDbContext decision
  - [ ] Create migration strategy document
  - [ ] Test transaction boundaries

- [ ] **Week 6:** UI/UX Polish
  - [ ] Implement grid context menu
  - [ ] Implement bulk actions
  - [ ] Mobile responsive improvements
  - [ ] Component documentation

### Phase 4: Scaling (Weeks 7-10)
- [ ] **Weeks 7-8:** Module Replication
  - [ ] Copy template to 5 more modules
  - [ ] Student module
  - [ ] Application module
  - [ ] Agent module
  - [ ] Commission module
  - [ ] Course module

- [ ] **Weeks 9-10:** Advanced Features
  - [ ] Excel import/export
  - [ ] Advanced filtering UI
  - [ ] Dashboard widgets
  - [ ] Reporting engine

### Phase 5: Production Readiness (Weeks 11-12)
- [ ] **Week 11:** Testing & Quality
  - [ ] Unit test coverage > 60%
  - [ ] Integration tests for critical flows
  - [ ] Performance testing (load test)
  - [ ] Security audit

- [ ] **Week 12:** Deployment
  - [ ] Production environment setup
  - [ ] CI/CD pipeline
  - [ ] Monitoring & logging
  - [ ] Documentation finalization

### Phase 6: Business Logic (Months 4-12)
- [ ] **Months 4-6:** Core Business Modules (15 modules)
  - CRM, HR, Accounting, Inventory, Sales, etc.

- [ ] **Months 7-9:** Extended Modules (10 modules)
  - Marketing, Support, Finance, Procurement, etc.

- [ ] **Months 10-12:** Specialized Modules (5 modules)
  - Analytics, Reporting, Custom workflows, etc.

---

## Conclusion

এই architecture document অনুসরণ করলে আপনার **30+ module, 1000+ table** project টি হবে:

✅ **Scalable:** Database-per-module = independent scaling
✅ **Maintainable:** Clear module boundaries, CQRS pattern
✅ **Testable:** Unit tests, integration tests at module level
✅ **Evolvable:** Can extract to microservices later
✅ **Developer-Friendly:** Copy-paste module template, predictable structure

**Key Success Factors:**
1. **Discipline:** Stick to the module structure template
2. **Grid Service:** Use shared grid service (don't reinvent per module)
3. **Domain Events:** Use events for cross-module communication
4. **Documentation:** Update docs as you go

**Your Next Steps:**
1. Review this document with your team
2. Approve the architecture
3. I'll implement Phase 1 (Grid Infrastructure)
4. You replicate to remaining modules

Let's build something amazing! 🚀
