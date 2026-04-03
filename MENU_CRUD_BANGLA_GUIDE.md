# Menu CRUD - সংক্ষিপ্ত বাংলা গাইড

## কি কি তৈরি করা হয়েছে

### ব্যাকএন্ড (Backend):

#### 1. DTOs (Data Transfer Objects)
📁 `src/CrossCutting/bdDevs.Contracts/`
- ✅ `CreateMenuRequest.cs` - নতুন menu তৈরির জন্য data
- ✅ `UpdateMenuRequest.cs` - Menu update করার জন্য data
- ✅ `MenuDto.cs` - Menu response data

#### 2. CQRS Commands & Queries
📁 `src/SharedKernel/bdDevs.Application/Features/Menus/`

**Commands (তৈরি/পরিবর্তন/মুছে ফেলা):**
- ✅ `CreateMenuCommand.cs` - নতুন menu তৈরি
- ✅ `UpdateMenuCommand.cs` - Menu update
- ✅ `DeleteMenuCommand.cs` - Menu delete

**Queries (তথ্য পড়া):**
- ✅ `GetAllMenusQuery.cs` - সব menus
- ✅ `GetMenuByIdQuery.cs` - একটি specific menu
- ✅ `GetMenusByModuleQuery.cs` - Module অনুযায়ী menus

#### 3. API Controller
📁 `src/Presentation/bdDevs.Api/Controllers/MenuController.cs`
- ✅ সম্পূর্ণ CRUD endpoints আছে

### ফ্রন্টএন্ড (Frontend):

#### 1. Web Controller
📁 `src/Presentation/bdDevs.Web/Controllers/MenuManagementController.cs`
- ✅ Menu management page এর controller

#### 2. Razor View
📁 `src/Presentation/bdDevs.Web/Views/MenuManagement/Index.cshtml`
- ✅ সুন্দর UI with Bootstrap 5
- ✅ Table এ সব menus দেখাবে
- ✅ Add/Edit/Delete buttons
- ✅ Modal form

#### 3. JavaScript
📁 `src/Presentation/bdDevs.Web/wwwroot/js/modules/menu-management.js`
- ✅ সম্পূর্ণ frontend functionality
- ✅ AJAX calls
- ✅ Form handling
- ✅ Validation

---

## API Endpoints

### 1. সব Menus দেখা
```
GET /api/menu
```

### 2. নির্দিষ্ট Menu দেখা
```
GET /api/menu/{id}
```

### 3. নতুন Menu তৈরি
```
POST /api/menu
Body: {
  "moduleId": 1,
  "menuName": "নতুন মেনু",
  "menuPath": "/path",
  "parentMenu": null,
  "sororder": 1,
  "isActive": 1
}
```

### 4. Menu Update করা
```
PUT /api/menu/{id}
Body: {
  "menuId": 1,
  "moduleId": 1,
  "menuName": "আপডেট মেনু",
  ...
}
```

### 5. Menu মুছে ফেলা
```
DELETE /api/menu/{id}
```

---

## কিভাবে ব্যবহার করবেন

### 1. Frontend Page দেখতে:
```
http://localhost:5000/MenuManagement
```

### 2. নতুন Menu যোগ করতে:
1. "Add New Menu" button এ click করুন
2. Form পূরণ করুন
3. "Save Menu" click করুন

### 3. Menu Edit করতে:
1. যে menu edit করবেন তার পাশে edit (পেন্সিল) icon এ click করুন
2. Data পরিবর্তন করুন
3. "Save Menu" click করুন

### 4. Menu Delete করতে:
1. Delete (ডাস্টবিন) icon এ click করুন
2. Confirmation dialog এ "OK" click করুন

---

## Features

### ব্যাকএন্ড:
✅ Clean Architecture
✅ CQRS Pattern
✅ MediatR
✅ Entity Framework Core
✅ RESTful API
✅ Swagger Documentation
✅ Input Validation
✅ Error Handling

### ফ্রন্টএন্ড:
✅ Responsive Design (Bootstrap 5)
✅ AJAX (No page reload)
✅ Modal Forms
✅ Form Validation
✅ Toast Notifications
✅ Confirmation Dialogs
✅ Active/Inactive Badge
✅ XSS Protection

---

## Database Schema

```sql
Menu Table:
├── MenuID (Primary Key)
├── ModuleID (Required)
├── MenuName (Required, max 50 chars)
├── MenuPath (Optional, max 200 chars)
├── ParentMenu (Optional, self-reference)
├── SORORDER (Optional, for ordering)
├── TODO (Optional, badge counter)
└── IsActive (Optional, 1=Active, 0=Inactive)
```

---

## Testing

### 1. Swagger দিয়ে Test:
```
https://localhost:5001/swagger
```
- সব endpoints test করুন
- Request/Response check করুন

### 2. Browser দিয়ে Test:
1. `/MenuManagement` page এ যান
2. Add, Edit, Delete করে দেখুন
3. Browser Console check করুন (F12)

### 3. Postman দিয়ে Test:
- Import করুন API endpoints
- সব operations test করুন

---

## Important Files

### Backend:
```
Commands/Queries: src/SharedKernel/bdDevs.Application/Features/Menus/
DTOs: src/CrossCutting/bdDevs.Contracts/
Controller: src/Presentation/bdDevs.Api/Controllers/MenuController.cs
```

### Frontend:
```
View: src/Presentation/bdDevs.Web/Views/MenuManagement/Index.cshtml
JS: src/Presentation/bdDevs.Web/wwwroot/js/modules/menu-management.js
Controller: src/Presentation/bdDevs.Web/Controllers/MenuManagementController.cs
```

---

## Next Steps (পরবর্তী কাজ)

1. ✅ Code compile করুন
2. ✅ Database এ Menu table আছে কিনা check করুন
3. ✅ Application run করুন
4. ✅ Swagger এ API test করুন
5. ✅ Frontend page test করুন

---

## প্রয়োজনীয় Packages (Already Installed)

- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- MediatR
- Swashbuckle.AspNetCore (Swagger)
- Bootstrap 5 (Frontend)

---

## Security

✅ Authorization: `[Authorize]` attribute দিয়ে protected
✅ Input Validation: Data annotations দিয়ে validate করা
✅ XSS Protection: HTML escaping করা হয়েছে
✅ SQL Injection: EF Core parameterized queries

---

## সাহায্যের জন্য

- বিস্তারিত ইংরেজি documentation: `MENU_CRUD_DOCUMENTATION.md`
- Swagger UI: `/swagger`
- Code comments check করুন

---

**তৈরি করেছেন:** Claude Assistant
**তারিখ:** ২০২৬-০৪-০৩
**Version:** 1.0

---

## Summary

আপনার Menu.cs entity এর জন্য সম্পূর্ণ CRUD system তৈরি করা হয়েছে:

1. ✅ Backend API (7 endpoints)
2. ✅ CQRS Commands & Queries (6 handlers)
3. ✅ DTOs (3 files)
4. ✅ Frontend Web Page (Razor view)
5. ✅ JavaScript Module (Complete functionality)
6. ✅ Documentation (Bengali + English)

সব কিছু Clean Architecture এবং best practices অনুসরণ করে তৈরি করা হয়েছে।
