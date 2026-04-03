**Phase 1: Cleanup & Foundation (পরিষ্কার এবং ভিত্তি স্থাপন)**

**উদ্দেশ্য:**

TypeScript সরানো, duplicate files মুছে ফেলা, এবং project কে clean করা

**কাজের তালিকা:**

1.  **TypeScript সম্পূর্ণ সরানো**

    -   ts-src/ folder মুছে ফেলা

    -   tsconfig.json মুছে ফেলা

    -   build.js মুছে ফেলা

    -   package.json থেকে TypeScript, ESBuild, ESLint dependencies সরানো

    -   \@microsoft/signalr রাখা (notification এর জন্য প্রয়োজন)

2.  **Duplicate Files পরিষ্কার করা**

    -   \_Layout.cshtml মুছে \_Layout_2.cshtml কে \_Layout.cshtml এ
        rename করা

    -   \_CommandPalette.cshtml এবং \_CommandPalette_2.cshtml মুছে নতুন
        বানানো

    -   \_NotificationPanel.cshtml মুছে \_NotificationPanel_2.cshtml কে
        rename করা

    -   \_PageHeader_2.cshtml মুছে ফেলা (\_PageHeader.cshtml রাখা)

    -   \_Footer_2.cshtml মুছে ফেলা (\_Footer.cshtml রাখা)

    -   \_Sidebar.cshtml থেকে commented code পরিষ্কার করা

    -   wwwroot/css/layout.css মুছে layout_2.css কে layout.css এ rename
        করা

    -   wwwroot/css/components.css মুছে components2.css কে components.css এ
        rename করা

    -   wwwroot/js/dist/ folder মুছে ফেলা (compiled TypeScript output)

3.  **Git Clean করা**

    -   সব পরিবর্তন commit করা

    -   Branch clean রাখা

**আউটপুট:**

✅ Clean codebase যেখানে শুধু final files আছে ✅ TypeScript সম্পূর্ণভাবে
সরানো হয়েছে ✅ কোনো duplicate files নেই

**Phase 2: Core JavaScript Utilities (মূল JavaScript Utilities তৈরি)**

**উদ্দেশ্য:**

Reusable JavaScript utilities তৈরি করা যা সব module এ ব্যবহার হবে

**কাজের তালিকা:**

1.  **wwwroot/js/core/ folder তৈরি করা**

2.  **6টি Core Utility File তৈরি করা:**

> **a) core/api.js** - jQuery \$.ajax based API service

-   bdApi.get(url, params)

-   bdApi.post(url, data)

-   bdApi.put(url, data)

-   bdApi.delete(url)

-   bdApi.kendoRead() - Kendo DataSource এর জন্য

-   Error handling (401 redirect, 403 access denied, 500 server error)

-   Loading indicator integration

> **b) core/event-bus.js** - Pub/Sub event system

-   bdEvents.publish(eventName, data)

-   bdEvents.subscribe(eventName, callback)

-   bdEvents.unsubscribe(eventName, callback)

-   Module간 communication এর জন্য

> **c) core/notify.js** - Kendo Notification based toast

-   bdNotify.success(message, duration)

-   bdNotify.error(message, duration)

-   bdNotify.warning(message, duration)

-   bdNotify.info(message, duration)

-   Position: top-right

-   Auto-hide with configurable duration

> **d) core/permissions.js** - Role-based UI permission manager

-   bdPermissions.init(permissions) - Server থেকে permissions load

-   bdPermissions.can(module, action) - Permission check

-   bdPermissions.applyToElements() - data-permission attribute দেখে
    hide/disable

-   sessionStorage এ cache করা

> **e) core/grid-base.js** - Reusable Kendo Grid configuration

-   bdGridBase.createDataSource(options) - Common DataSource config

-   bdGridBase.applyRowHighlight(grid) - Status অনুযায়ী row color

-   bdGridBase.saveState(key, grid) - Grid state localStorage এ save

-   bdGridBase.restoreState(key, grid) - State restore করা

-   bdGridBase.getDefaultToolbar() - Common toolbar buttons

-   bdGridBase.getDefaultPageable() - Pager configuration

> **f) core/form-base.js** - Reusable Form utilities

-   bdFormBase.initValidator(formSelector, rules) - Kendo Validator
    setup

-   bdFormBase.collectData(formSelector) - Form data serialization

-   bdFormBase.showServerErrors(errors) - Server validation errors
    দেখানো

-   bdFormBase.preventDoubleSubmit(buttonSelector) - Double submit
    prevent

-   bdFormBase.resetForm(formSelector) - Form reset

-   bdFormBase.markAsRequired(fields) - Required fields mark করা

3.  **\_Layout.cshtml এ script loading order update করা**

    -   Core utilities load হবে app.js এর আগে

    -   সঠিক sequence maintain করা

4.  **Testing**

    -   Browser console এ global objects check করা

    -   প্রতিটি utility function test করা

**আউটপুট:**

✅ 6টি reusable core utilities তৈরি হয়েছে ✅ সব module এ ব্যবহার করা যাবে
✅ Consistent API pattern established

**Phase 3: CSS Enhancement & Component Styles (CSS উন্নতি এবং Component
Styles)**

**উদ্দেশ্য:**

Grid, Form, এবং অন্যান্য UI components এর জন্য consistent styles তৈরি করা

**কাজের তালিকা:**

1.  **components.css enhance করা**

    -   Grid specific styles যোগ করা:

        -   .bd-grid-container

        -   .bd-grid-toolbar

        -   .bd-filter-panel (collapsible)

        -   .bd-status-badge (success, error, warning, info)

        -   .bd-action-buttons

        -   Row highlight colors

    -   Form specific styles যোগ করা:

        -   .bd-form-group

        -   .bd-form-label.required::after { content: \"\*\"; color:
            red; }

        -   .bd-form-error

        -   .bd-form-actions

        -   Tabbed form styles

    -   Modal styles:

        -   .bd-modal-header

        -   .bd-modal-body

        -   .bd-modal-footer

    -   Empty state styles:

        -   .bd-empty-state

        -   Icon, message, action button

2.  **design-tokens.css update করা (যদি প্রয়োজন হয়)**

    -   Status colors define করা

    -   Spacing tokens

    -   Typography tokens

3.  **Responsive considerations**

    -   Mobile-friendly grid

    -   Touch-friendly buttons

    -   Collapsible panels for mobile

**আউটপুট:**

✅ Comprehensive component styles ✅ Consistent look & feel ✅
Responsive design ready

**Phase 4: Command Palette & Navigation Enhancement (Command Palette এবং
Navigation উন্নতি)**

**উদ্দেশ্য:**

Command Palette নতুন করে বানানো এবং navigation improve করা

**কাজের তালিকা:**

1.  **\_CommandPalette.cshtml নতুন করে তৈরি করা**

    -   Kendo Window based modal

    -   Search input field

    -   Command list (filterable)

    -   Keyboard navigation (Up/Down arrow, Enter)

    -   Recent commands tracking

    -   Module navigation shortcuts

2.  **command-palette.js enhance করা**

    -   Ctrl+K shortcut binding

    -   Fuzzy search implementation

    -   Command categories (Navigation, Actions, Recent)

    -   Command execution

    -   Recent commands localStorage এ save করা

3.  **\_Sidebar.cshtml improve করা**

    -   Group-based navigation (৬-৭ groups for 30+ modules)

    -   Collapse/expand groups

    -   Active menu item highlighting

    -   Permission-based menu visibility

4.  **Breadcrumb enhancement**

    -   Dynamic breadcrumb generation

    -   Clickable navigation

    -   Icon support

**আউটপুট:**

✅ Functional Command Palette (Ctrl+K) ✅ Improved sidebar navigation ✅
Better UX for navigation

**Phase 5: Reference Module Implementation (নমুনা Module তৈরি)**

**উদ্দেশ্য:**

Employee module তৈরি করা যা অন্য সব module এর reference/template হবে

**কাজের তালিকা:**

1.  **Employee Module তৈরি করা**

    -   Views/Employee/Index.cshtml - List page with Grid

    -   Views/Employee/\_EmployeeModal.cshtml - Tabbed Modal Form (১৫-২৫
        fields)

    -   wwwroot/js/modules/employee.js - Module specific JavaScript

2.  **Grid Implementation**

    -   bdGridBase.createDataSource() ব্যবহার করা

    -   Filter panel (collapsible)

    -   Toolbar (Add, Export Excel, Export PDF, Refresh, Column Chooser)

    -   Columns: Checkbox, Name, Email, Department, Status Badge,
        Actions

    -   Server-side paging, sorting, filtering

    -   State save/restore

    -   Row highlighting

    -   Empty state

    -   Bulk actions (delete selected)

3.  **Form Implementation**

    -   Tabbed form (Personal Info, Contact, Employment Details)

    -   bdFormBase.initValidator() ব্যবহার করা

    -   Required field marking

    -   Validation on blur + submit

    -   Server error handling

    -   Auto-save draft (every 2 minutes)

    -   Unsaved changes warning

    -   Double submit prevention

    -   Dependent fields (e.g., Department → Position)

4.  **Permission Integration**

    -   data-permission=\"Employee:View\" - View button

    -   data-permission=\"Employee:Create\" - Add button

    -   data-permission=\"Employee:Edit\" - Edit button

    -   data-permission=\"Employee:Delete\" - Delete button

    -   bdPermissions.can() ব্যবহার করা

5.  **API Integration**

    -   bdApi.get(\'/api/employees\') - List

    -   bdApi.get(\'/api/employees/{id}\') - Details

    -   bdApi.post(\'/api/employees\') - Create

    -   bdApi.put(\'/api/employees/{id}\') - Update

    -   bdApi.delete(\'/api/employees/{id}\') - Delete

    -   Export API endpoints

6.  **Documentation**

    -   Employee module এর code কে reference হিসেবে document করা

    -   Comments যোগ করা

    -   Pattern explanation

**আউটপুট:**

✅ Fully functional Employee module ✅ Reference implementation for
other modules ✅ All patterns demonstrated (Grid, Tabbed Form,
Permission, API, Validation)

**Phase Summary & Timeline Suggestion**

  ------------------------------------------------------------------------
  **Phase**    **কাজ**                             **আনুমানিক সময়**
  ------------ ----------------------------------- -----------------------
  **Phase 1**  Cleanup & Foundation                1-2 দিন

  **Phase 2**  Core JavaScript Utilities           2-3 দিন

  **Phase 3**  CSS Enhancement                     1-2 দিন

  **Phase 4**  Command Palette & Navigation        2-3 দিন

  **Phase 5**  Reference Module (Employee)         3-4 দিন
  ------------------------------------------------------------------------

**মোট সময়:** প্রায় 9-14 দিন (testing এবং refinement সহ)

**Recommended Approach**

1.  **Sequential Execution:** Phase 1 → Phase 2 → Phase 3 → Phase 4 →
    Phase 5 অনুসরণ করা

2.  **After Each Phase:** Code review, testing, এবং documentation

3.  **Git Strategy:** প্রতিটি phase এর জন্য আলাদা branch এবং PR তৈরি করা

4.  **Continuous Testing:** প্রতিটি change এর পর browser এ test করা

**Next Steps**

আপনি কোন phase দিয়ে শুরু করতে চান?

-   **Phase 1** দিয়ে শুরু করা সবচেয়ে logical (cleanup প্রথমে)

-   অথবা আপনার priority অনুযায়ী অন্য কোনো phase

আপনার মতামত জানান, তাহলে আমরা সেই phase এর detailed plan নিয়ে আলোচনা
করতে পারি! 🚀 \</plan\>

\<plan\> \# bdDevs Enterprise Application - Implementation Phase Plan

পুরো কাজকে নিচের **5টি Phase** এ ভাগ করা যায়:

**Phase 1: Cleanup & Foundation (পরিষ্কার এবং ভিত্তি স্থাপন)**

**উদ্দেশ্য:**

TypeScript সরানো, duplicate files মুছে ফেলা, এবং project কে clean করা

**কাজের তালিকা:**

1.  **TypeScript সম্পূর্ণ সরানো**

    -   ts-src/ folder মুছে ফেলা

    -   tsconfig.json মুছে ফেলা

    -   build.js মুছে ফেলা

    -   package.json থেকে TypeScript, ESBuild, ESLint dependencies সরানো

    -   \@microsoft/signalr রাখা (notification এর জন্য প্রয়োজন)

2.  **Duplicate Files পরিষ্কার করা**

    -   \_Layout.cshtml মুছে \_Layout_2.cshtml কে \_Layout.cshtml এ
        rename করা

    -   \_CommandPalette.cshtml এবং \_CommandPalette_2.cshtml মুছে নতুন
        বানানো

    -   \_NotificationPanel.cshtml মুছে \_NotificationPanel_2.cshtml কে
        rename করা

    -   \_PageHeader_2.cshtml মুছে ফেলা (\_PageHeader.cshtml রাখা)

    -   \_Footer_2.cshtml মুছে ফেলা (\_Footer.cshtml রাখা)

    -   \_Sidebar.cshtml থেকে commented code পরিষ্কার করা

    -   wwwroot/css/layout.css মুছে layout_2.css কে layout.css এ rename
        করা

    -   wwwroot/css/components.css মুছে components2.css কে components.css এ
        rename করা

    -   wwwroot/js/dist/ folder মুছে ফেলা (compiled TypeScript output)

3.  **Git Clean করা**

    -   সব পরিবর্তন commit করা

    -   Branch clean রাখা

**আউটপুট:**

✅ Clean codebase যেখানে শুধু final files আছে ✅ TypeScript সম্পূর্ণভাবে
সরানো হয়েছে ✅ কোনো duplicate files নেই

**Phase 2: Core JavaScript Utilities (মূল JavaScript Utilities তৈরি)**

**উদ্দেশ্য:**

Reusable JavaScript utilities তৈরি করা যা সব module এ ব্যবহার হবে

**কাজের তালিকা:**

1.  **wwwroot/js/core/ folder তৈরি করা**

2.  **6টি Core Utility File তৈরি করা:**

> **a) core/api.js** - jQuery \$.ajax based API service

-   bdApi.get(url, params)

-   bdApi.post(url, data)

-   bdApi.put(url, data)

-   bdApi.delete(url)

-   bdApi.kendoRead() - Kendo DataSource এর জন্য

-   Error handling (401 redirect, 403 access denied, 500 server error)

-   Loading indicator integration

> **b) core/event-bus.js** - Pub/Sub event system

-   bdEvents.publish(eventName, data)

-   bdEvents.subscribe(eventName, callback)

-   bdEvents.unsubscribe(eventName, callback)

-   Module간 communication এর জন্য

> **c) core/notify.js** - Kendo Notification based toast

-   bdNotify.success(message, duration)

-   bdNotify.error(message, duration)

-   bdNotify.warning(message, duration)

-   bdNotify.info(message, duration)

-   Position: top-right

-   Auto-hide with configurable duration

> **d) core/permissions.js** - Role-based UI permission manager

-   bdPermissions.init(permissions) - Server থেকে permissions load

-   bdPermissions.can(module, action) - Permission check

-   bdPermissions.applyToElements() - data-permission attribute দেখে
    hide/disable

-   sessionStorage এ cache করা

> **e) core/grid-base.js** - Reusable Kendo Grid configuration

-   bdGridBase.createDataSource(options) - Common DataSource config

-   bdGridBase.applyRowHighlight(grid) - Status অনুযায়ী row color

-   bdGridBase.saveState(key, grid) - Grid state localStorage এ save

-   bdGridBase.restoreState(key, grid) - State restore করা

-   bdGridBase.getDefaultToolbar() - Common toolbar buttons

-   bdGridBase.getDefaultPageable() - Pager configuration

> **f) core/form-base.js** - Reusable Form utilities

-   bdFormBase.initValidator(formSelector, rules) - Kendo Validator
    setup

-   bdFormBase.collectData(formSelector) - Form data serialization

-   bdFormBase.showServerErrors(errors) - Server validation errors
    দেখানো

-   bdFormBase.preventDoubleSubmit(buttonSelector) - Double submit
    prevent

-   bdFormBase.resetForm(formSelector) - Form reset

-   bdFormBase.markAsRequired(fields) - Required fields mark করা

3.  **\_Layout.cshtml এ script loading order update করা**

    -   Core utilities load হবে app.js এর আগে

    -   সঠিক sequence maintain করা

4.  **Testing**

    -   Browser console এ global objects check করা

    -   প্রতিটি utility function test করা

**আউটপুট:**

✅ 6টি reusable core utilities তৈরি হয়েছে ✅ সব module এ ব্যবহার করা যাবে
✅ Consistent API pattern established

**Phase 3: CSS Enhancement & Component Styles (CSS উন্নতি এবং Component
Styles)**

**উদ্দেশ্য:**

Grid, Form, এবং অন্যান্য UI components এর জন্য consistent styles তৈরি করা

**কাজের তালিকা:**

1.  **components.css enhance করা**

    -   Grid specific styles যোগ করা:

        -   .bd-grid-container

        -   .bd-grid-toolbar

        -   .bd-filter-panel (collapsible)

        -   .bd-status-badge (success, error, warning, info)

        -   .bd-action-buttons

        -   Row highlight colors

    -   Form specific styles যোগ করা:

        -   .bd-form-group

        -   .bd-form-label.required::after { content: \"\*\"; color:
            red; }

        -   .bd-form-error

        -   .bd-form-actions

        -   Tabbed form styles

    -   Modal styles:

        -   .bd-modal-header

        -   .bd-modal-body

        -   .bd-modal-footer

    -   Empty state styles:

        -   .bd-empty-state

        -   Icon, message, action button

2.  **design-tokens.css update করা (যদি প্রয়োজন হয়)**

    -   Status colors define করা

    -   Spacing tokens

    -   Typography tokens

3.  **Responsive considerations**

    -   Mobile-friendly grid

    -   Touch-friendly buttons

    -   Collapsible panels for mobile

**আউটপুট:**

✅ Comprehensive component styles ✅ Consistent look & feel ✅
Responsive design ready

**Phase 4: Command Palette & Navigation Enhancement (Command Palette এবং
Navigation উন্নতি)**

**উদ্দেশ্য:**

Command Palette নতুন করে বানানো এবং navigation improve করা

**কাজের তালিকা:**

1.  **\_CommandPalette.cshtml নতুন করে তৈরি করা**

    -   Kendo Window based modal

    -   Search input field

    -   Command list (filterable)

    -   Keyboard navigation (Up/Down arrow, Enter)

    -   Recent commands tracking

    -   Module navigation shortcuts

2.  **command-palette.js enhance করা**

    -   Ctrl+K shortcut binding

    -   Fuzzy search implementation

    -   Command categories (Navigation, Actions, Recent)

    -   Command execution

    -   Recent commands localStorage এ save করা

3.  **\_Sidebar.cshtml improve করা**

    -   Group-based navigation (৬-৭ groups for 30+ modules)

    -   Collapse/expand groups

    -   Active menu item highlighting

    -   Permission-based menu visibility

4.  **Breadcrumb enhancement**

    -   Dynamic breadcrumb generation

    -   Clickable navigation

    -   Icon support

**আউটপুট:**

✅ Functional Command Palette (Ctrl+K) ✅ Improved sidebar navigation ✅
Better UX for navigation

**Phase 5: Reference Module Implementation (নমুনা Module তৈরি)**

**উদ্দেশ্য:**

Employee module তৈরি করা যা অন্য সব module এর reference/template হবে

**কাজের তালিকা:**

1.  **Employee Module তৈরি করা**

    -   Views/Employee/Index.cshtml - List page with Grid

    -   Views/Employee/\_EmployeeModal.cshtml - Tabbed Modal Form (১৫-২৫
        fields)

    -   wwwroot/js/modules/employee.js - Module specific JavaScript

2.  **Grid Implementation**

    -   bdGridBase.createDataSource() ব্যবহার করা

    -   Filter panel (collapsible)

    -   Toolbar (Add, Export Excel, Export PDF, Refresh, Column Chooser)

    -   Columns: Checkbox, Name, Email, Department, Status Badge,
        Actions

    -   Server-side paging, sorting, filtering

    -   State save/restore

    -   Row highlighting

    -   Empty state

    -   Bulk actions (delete selected)

3.  **Form Implementation**

    -   Tabbed form (Personal Info, Contact, Employment Details)

    -   bdFormBase.initValidator() ব্যবহার করা

    -   Required field marking

    -   Validation on blur + submit

    -   Server error handling

    -   Auto-save draft (every 2 minutes)

    -   Unsaved changes warning

    -   Double submit prevention

    -   Dependent fields (e.g., Department → Position)

4.  **Permission Integration**

    -   data-permission=\"Employee:View\" - View button

    -   data-permission=\"Employee:Create\" - Add button

    -   data-permission=\"Employee:Edit\" - Edit button

    -   data-permission=\"Employee:Delete\" - Delete button

    -   bdPermissions.can() ব্যবহার করা

5.  **API Integration**

    -   bdApi.get(\'/api/employees\') - List

    -   bdApi.get(\'/api/employees/{id}\') - Details

    -   bdApi.post(\'/api/employees\') - Create

    -   bdApi.put(\'/api/employees/{id}\') - Update

    -   bdApi.delete(\'/api/employees/{id}\') - Delete

    -   Export API endpoints

6.  **Documentation**

    -   Employee module এর code কে reference হিসেবে document করা

    -   Comments যোগ করা

    -   Pattern explanation

**আউটপুট:**

✅ Fully functional Employee module ✅ Reference implementation for
other modules ✅ All patterns demonstrated (Grid, Tabbed Form,
Permission, API, Validation)

**Phase Summary & Timeline Suggestion**

  ------------------------------------------------------------------------
  **Phase**    **কাজ**                             **আনুমানিক সময়**
  ------------ ----------------------------------- -----------------------
  **Phase 1**  Cleanup & Foundation                1-2 দিন

  **Phase 2**  Core JavaScript Utilities           2-3 দিন

  **Phase 3**  CSS Enhancement                     1-2 দিন

  **Phase 4**  Command Palette & Navigation        2-3 দিন

  **Phase 5**  Reference Module (Employee)         3-4 দিন
  ------------------------------------------------------------------------

**মোট সময়:** প্রায় 9-14 দিন (testing এবং refinement সহ)

**Recommended Approach**

1.  **Sequential Execution:** Phase 1 → Phase 2 → Phase 3 → Phase 4 →
    Phase 5 অনুসরণ করা

2.  **After Each Phase:** Code review, testing, এবং documentation

3.  **Git Strategy:** প্রতিটি phase এর জন্য আলাদা branch এবং PR তৈরি করা

4.  **Continuous Testing:** প্রতিটি change এর পর browser এ test করা

**Next Steps**

আপনি কোন phase দিয়ে শুরু করতে চান?

-   **Phase 1** দিয়ে শুরু করা সবচেয়ে logical (cleanup প্রথমে)

-   অথবা আপনার priority অনুযায়ী অন্য কোনো phase

আপনার মতামত জানান, তাহলে আমরা সেই phase এর detailed plan নিয়ে আলোচনা
করতে পারি! 🚀 \</plan\>
