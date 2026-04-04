# Menu CRUD Implementation - Complete Documentation

## Overview
এই implementation Menu entity এর জন্য complete CRUD (Create, Read, Update, Delete) functionality প্রদান করে। Backend এ Clean Architecture এবং CQRS pattern ব্যবহার করা হয়েছে।

---

## Backend Implementation

### 1. DTOs (Data Transfer Objects)
**Location:** `src/CrossCutting/bdDevs.Contracts/`

#### Request DTOs:
- **CreateMenuRequest.cs** - নতুন menu তৈরির জন্য
- **UpdateMenuRequest.cs** - Menu update করার জন্য

#### Response DTOs:
- **MenuDto.cs** - Menu data return করার জন্য

### 2. CQRS Commands & Queries
**Location:** `src/SharedKernel/bdDevs.Application/Features/Menus/`

#### Commands:
1. **CreateMenuCommand.cs**
   - নতুন menu তৈরি করে
   - Handler: `CreateMenuCommandHandler`

2. **UpdateMenuCommand.cs**
   - Existing menu update করে
   - Handler: `UpdateMenuCommandHandler`

3. **DeleteMenuCommand.cs**
   - Menu delete করে
   - Handler: `DeleteMenuCommandHandler`

#### Queries:
1. **GetAllMenusQuery.cs**
   - সব menus retrieve করে
   - Handler: `GetAllMenusQueryHandler`

2. **GetMenuByIdQuery.cs**
   - Specific menu ID দিয়ে menu খুঁজে
   - Handler: `GetMenuByIdQueryHandler`

3. **GetMenusByModuleQuery.cs**
   - Module ID অনুযায়ী menus filter করে
   - Handler: `GetMenusByModuleQueryHandler`

### 3. API Controller
**Location:** `src/Presentation/bdDevs.Api/Controllers/MenuController.cs`

#### Endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu/user-menu` | User-specific menu tree (permission-based) |
| GET | `/api/menu` | All menus (admin) |
| GET | `/api/menu/{id}` | Single menu by ID |
| GET | `/api/menu/module/{moduleId}` | Menus by module |
| POST | `/api/menu` | Create new menu |
| PUT | `/api/menu/{id}` | Update menu |
| DELETE | `/api/menu/{id}` | Delete menu |

#### Example API Calls:

```javascript
// Get all menus
GET /api/menu
Response: {
  "success": true,
  "data": [
    {
      "menuId": 1,
      "moduleId": 1,
      "menuName": "Dashboard",
      "menuPath": "/dashboard",
      "parentMenu": null,
      "sororder": 1,
      "todo": 0,
      "isActive": 1
    }
  ],
  "correlationId": "..."
}

// Create menu
POST /api/menu
Body: {
  "moduleId": 1,
  "menuName": "User Management",
  "menuPath": "/admin/users",
  "parentMenu": null,
  "sororder": 2,
  "todo": 0,
  "isActive": 1
}

// Update menu
PUT /api/menu/1
Body: {
  "menuId": 1,
  "moduleId": 1,
  "menuName": "Updated Dashboard",
  "menuPath": "/dashboard",
  "parentMenu": null,
  "sororder": 1,
  "todo": 5,
  "isActive": 1
}

// Delete menu
DELETE /api/menu/1
```

---

## Frontend Implementation

### 1. Web Controller
**Location:** `src/Presentation/bdDevs.Web/Controllers/MenuManagementController.cs`

Simple controller যা Index view render করে।

### 2. View (Razor Page)
**Location:** `src/Presentation/bdDevs.Web/Views/MenuManagement/Index.cshtml`

Features:
- ✅ Responsive table with all menu data
- ✅ Add new menu button
- ✅ Edit button for each menu
- ✅ Delete button with confirmation
- ✅ Bootstrap modal for Add/Edit form
- ✅ Form validation
- ✅ Active/Inactive status badge

### 3. JavaScript Module
**Location:** `src/Presentation/bdDevs.Web/wwwroot/js/modules/menu-management.js`

#### Key Functions:

```javascript
// Load all menus
loadMenus()

// Show add form
showAddMenuForm()

// Edit menu
editMenu(menuId)

// Save menu (create or update)
saveMenu()

// Delete menu
deleteMenu(menuId, menuName)
```

---

## Usage Guide

### Backend Setup:

1. **Add DbContext registration** (if not already done):
```csharp
// In Program.cs or ServiceCollectionExtensions
services.AddDbContext<CoreDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("Default")));
```

2. **Register MediatR** (already done in your ApplicationServiceExtensions):
```csharp
services.AddMediatR(typeof(CreateMenuCommand).Assembly);
```

### Frontend Setup:

1. **Add navigation link** in your layout:
```html
<a href="/MenuManagement" class="nav-link">
    <i class="bi bi-menu-button-wide"></i> Menu Management
</a>
```

2. **Include Bootstrap Icons** (for UI icons):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
```

### Access the page:
Navigate to: `https://your-domain/MenuManagement`

---

## Testing

### Manual Testing:

1. **Create Menu:**
   - Click "Add New Menu"
   - Fill all required fields
   - Click "Save Menu"
   - Verify menu appears in table

2. **Edit Menu:**
   - Click edit icon on any menu
   - Modify values
   - Click "Save Menu"
   - Verify changes reflected

3. **Delete Menu:**
   - Click delete icon
   - Confirm deletion
   - Verify menu removed from table

### API Testing with Swagger:
Navigate to: `https://your-domain/swagger`
- Test all endpoints
- Check request/response formats
- Verify error handling

### Postman/cURL Testing:

```bash
# Get all menus
curl -X GET "https://localhost:5001/api/menu" -H "accept: application/json"

# Create menu
curl -X POST "https://localhost:5001/api/menu" \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": 1,
    "menuName": "Test Menu",
    "menuPath": "/test",
    "sororder": 1,
    "isActive": 1
  }'

# Update menu
curl -X PUT "https://localhost:5001/api/menu/1" \
  -H "Content-Type: application/json" \
  -d '{
    "menuId": 1,
    "moduleId": 1,
    "menuName": "Updated Menu",
    "menuPath": "/test",
    "sororder": 1,
    "isActive": 1
  }'

# Delete menu
curl -X DELETE "https://localhost:5001/api/menu/1" -H "accept: application/json"
```

---

## Features

### Backend Features:
✅ Clean Architecture (Domain, Application, Infrastructure separation)
✅ CQRS Pattern (Command Query Responsibility Segregation)
✅ MediatR for command/query handling
✅ Repository pattern with EF Core
✅ DTOs for data transfer
✅ Input validation
✅ Error handling
✅ RESTful API design
✅ Swagger documentation

### Frontend Features:
✅ Responsive design with Bootstrap 5
✅ AJAX calls for smooth UX
✅ Modal-based forms
✅ Form validation
✅ Confirmation dialogs
✅ Toast notifications
✅ Loading indicators
✅ XSS protection (HTML escaping)
✅ Active/Inactive status badges

---

## Database Schema

```sql
Table: Menu
Columns:
- MenuID (int, PK)
- ModuleID (int, required)
- MenuName (nvarchar(50), required)
- MenuPath (nvarchar(200), nullable)
- ParentMenu (int, nullable) -- Self-referencing FK
- SORORDER (int, nullable)
- TODO (int, nullable)
- IsActive (int, nullable)
```

---

## Security Considerations

1. **Authorization:** Controller এ `[Authorize]` attribute আছে
2. **Input Validation:** DTOs তে validation attributes আছে
3. **XSS Protection:** Frontend এ HTML escaping করা হয়েছে
4. **SQL Injection:** EF Core parameterized queries ব্যবহার করে

---

## Future Enhancements

1. **Hierarchical Display:** Tree view for parent-child relationships
2. **Drag & Drop:** Reorder menus with drag-and-drop
3. **Bulk Operations:** Select multiple menus for bulk delete/activate
4. **Search & Filter:** Search by name, filter by module/status
5. **Pagination:** For large datasets
6. **Audit Log:** Track who created/modified menus
7. **Permission Integration:** Link menus with GroupPermission table
8. **Icon Picker:** Visual icon selection for menus
9. **Preview:** Preview menu structure before saving

---

## Troubleshooting

### Common Issues:

1. **404 Not Found:**
   - Check API route matches frontend calls
   - Verify controller route is `[Route("api/[controller]")]`

2. **401 Unauthorized:**
   - Ensure user is authenticated
   - Check JWT token is included in requests

3. **Form not submitting:**
   - Check browser console for errors
   - Verify API_BASE_URL is correct
   - Check CORS settings if API is on different domain

4. **Menu not loading:**
   - Check browser network tab
   - Verify database connection
   - Check CoreDbContext is registered

---

## File Structure Summary

```
src/
├── CrossCutting/
│   └── bdDevs.Contracts/
│       ├── Requests/
│       │   ├── CreateMenuRequest.cs
│       │   └── UpdateMenuRequest.cs
│       └── Responses/
│           └── MenuDto.cs
│
├── SharedKernel/
│   ├── bdDevs.Domain/
│   │   └── Entities/
│   │       └── Menu.cs (existing)
│   │
│   ├── bdDevs.Application/
│   │   └── Features/
│   │       └── Menus/
│   │           ├── Commands/
│   │           │   ├── CreateMenuCommand.cs
│   │           │   ├── UpdateMenuCommand.cs
│   │           │   └── DeleteMenuCommand.cs
│   │           └── Queries/
│   │               ├── GetAllMenusQuery.cs
│   │               ├── GetMenuByIdQuery.cs
│   │               └── GetMenusByModuleQuery.cs
│   │
│   └── bdDevs.Infrastructure/
│       └── Data/
│           └── CoreDbContext.cs (existing)
│
└── Presentation/
    ├── bdDevs.Api/
    │   └── Controllers/
    │       └── MenuController.cs (updated)
    │
    └── bdDevs.Web/
        ├── Controllers/
        │   └── MenuManagementController.cs
        ├── Views/
        │   └── MenuManagement/
        │       └── Index.cshtml
        └── wwwroot/
            └── js/
                └── modules/
                    └── menu-management.js
```

---

## Support

For questions or issues, refer to:
- API Swagger Documentation: `/swagger`
- Backend code comments
- JavaScript inline documentation

---

**Created by:** Claude Assistant
**Date:** 2026-04-03
**Version:** 1.0
