# UI/UX Component Documentation
## bdDevs Enterprise Design System - Component-wise Guide

**Date:** 2026-04-04
**Version:** 2.0
**Framework:** Kendo UI jQuery 2024 Q4
**Approach:** Mobile-First Responsive Design

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Grid Component](#2-grid-component)
3. [Form Component](#3-form-component)
4. [Modal/Dialog Component](#4-modaldialog-component)
5. [Card Component](#5-card-component)
6. [Button Component](#6-button-component)
7. [Tab Component](#7-tab-component)
8. [Page Layout Standard](#8-page-layout-standard)
9. [Mobile-First Responsive Guidelines](#9-mobile-first-responsive-guidelines)
10. [Component Usage Examples](#10-component-usage-examples)

---

## 1. Design Principles

### 1.1 Core Philosophy

**Enterprise-Level + User-Friendly + 30+ Module Scalable**

```
Enterprise Level = Consistent + Professional + Robust
User Friendly = Intuitive + Responsive + Accessible
Scalable = Reusable + Modular + Maintainable
```

### 1.2 Design Tokens

All components ব্যবহার করবে centralized design tokens:

```css
/* Spacing Scale */
--bd-space-1: 4px;
--bd-space-2: 8px;
--bd-space-3: 12px;
--bd-space-4: 16px;
--bd-space-5: 24px;
--bd-space-6: 32px;

/* Typography */
--bd-font-xs: 12px;
--bd-font-sm: 14px;
--bd-font-base: 16px;
--bd-font-lg: 18px;
--bd-font-xl: 20px;

/* Colors */
--bd-primary: #3b82f6;
--bd-success: #10b981;
--bd-warning: #f59e0b;
--bd-danger: #ef4444;
--bd-surface: #ffffff;
--bd-surface-hover: #f3f4f6;

/* Shadows */
--bd-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--bd-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--bd-shadow-lg: 0 10px 15px rgba(0,0,0,0.15);

/* Border Radius */
--bd-radius-sm: 4px;
--bd-radius-md: 6px;
--bd-radius-lg: 8px;
```

### 1.3 Reusability Strategy

**Single Source of Truth:**
```
wwwroot/
├── js/
│   └── core/
│       ├── grid-base.js        ← ALL grids use this
│       ├── form-base.js        ← ALL forms use this
│       ├── bd-modal.js         ← ALL modals use this
│       └── api.js              ← ALL API calls use this
├── css/
│   ├── design-tokens.css       ← ALL components reference
│   ├── design-system.css       ← Base component styles
│   └── components.css          ← Custom components
└── Views/
    └── Shared/
        ├── _GridPageShell.cshtml     ← Grid page template
        ├── _EmptyState.cshtml        ← Empty state partial
        └── _PageHeader.cshtml        ← Page header partial
```

**Usage Philosophy:**
- ✅ **Import** once, use everywhere
- ❌ **Never** copy-paste component code
- ✅ **Extend** via configuration options
- ❌ **Never** modify core components directly

---

## 2. Grid Component

### 2.1 Grid Architecture

```
Page View (.cshtml)
    ↓
Includes _GridPageShell.cshtml
    ↓
Defines getColumns() function
    ↓
Calls window.bdGrid.create()
    ↓
Uses window.bdApi.grid() for data
    ↓
Kendo Grid renders
```

### 2.2 Grid Anatomy

```html
┌─────────────────────────────────────────────────────────────┐
│ PAGE HEADER (breadcrumb + title + actions)                  │
├─────────────────────────────────────────────────────────────┤
│ GRID TOOLBAR                                                │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ [+ New] [⋮ Export▾] │ 🔍 Search... │ [⟳] [≡] [⚙]      │  │
│ └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ GRID TABLE                                                  │
│ ┌─────┬────────────┬──────────┬──────────┬────────────┐   │
│ │  ☐  │ Name       │ Email    │ Status   │ Actions    │   │
│ ├─────┼────────────┼──────────┼──────────┼────────────┤   │
│ │  ☐  │ John Doe   │ john@... │ ● Active │ [✏] [🗑]   │   │
│ │  ☐  │ Jane Smith │ jane@... │ ● Active │ [✏] [🗑]   │   │
│ │  ☐  │ Bob Wilson │ bob@...  │ ○ Inact. │ [✏] [🗑]   │   │
│ └─────┴────────────┴──────────┴──────────┴────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ PAGINATION                                                  │
│ Showing 1-20 of 156 │ [◄ Prev] [1] [2] [3] ... [8] [Next ►]│
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Grid Toolbar Design

#### Desktop Layout:
```
┌────────────────────────────────────────────────────────────┐
│ Left Section        │  Center         │  Right Section     │
│ [+ New] [⋮ Export▾] │  🔍 Search...   │  [⟳] [≡] [⚙]       │
└────────────────────────────────────────────────────────────┘
```

#### Mobile Layout (< 768px):
```
┌──────────────────────────────┐
│ 🔍 Search...        [⋮ Menu▾] │
├──────────────────────────────┤
│ [+ New]                      │ ← Expands from Menu
│ [⋮ Export]                   │
│ [⟳ Refresh]                  │
│ [≡ Columns]                  │
│ [⚙ Settings]                 │
└──────────────────────────────┘
```

#### Toolbar Buttons:

| Button | Type | Icon | Action | Permission |
|--------|------|------|--------|------------|
| **+ New** | Primary | k-i-plus | Opens create form | `{Module}.{Entity}.Create` |
| **⋮ Export** | Ghost Dropdown | k-i-download | Excel/PDF/CSV menu | `{Module}.{Entity}.Export` |
| **🔍 Search** | Input | k-i-search | Debounced 300ms search | Always visible |
| **⟳ Refresh** | Ghost Icon | k-i-reload | Reloads grid data | Always visible |
| **≡ Columns** | Ghost Icon | k-i-columns | Column chooser | Always visible |
| **⚙ Settings** | Ghost Icon | k-i-gear | Grid settings | Optional |

### 2.4 Grid Features Implementation

#### Server-Side Pagination
```javascript
// Configuration
pageSize: 20,
pageable: {
    refresh: true,
    pageSizes: [10, 20, 50, 100],
    buttonCount: 5,
    info: true,
    messages: {
        display: "Showing {0}-{1} of {2} items",
        empty: "No items to display"
    }
}
```

#### Server-Side Filtering
```javascript
// Column filterable config
filterable: {
    mode: "row", // or "menu"
    extra: false,
    operators: {
        string: {
            contains: "Contains",
            startswith: "Starts with",
            eq: "Equal to"
        },
        number: {
            eq: "Equal to",
            gte: "Greater than or equal",
            lte: "Less than or equal"
        }
    }
}
```

#### Server-Side Sorting
```javascript
// Column sortable config
sortable: {
    mode: "single", // or "multiple"
    allowUnsort: true,
    showIndexes: true
}
```

#### Debounced Search
```javascript
// Search input handler
let searchTimeout;
$('#gridSearch').on('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
        const searchValue = $('#gridSearch').val();
        grid.dataSource.filter({
            field: "searchText",
            operator: "contains",
            value: searchValue
        });
    }, 300); // 300ms debounce
});
```

### 2.5 Grid Column Configuration

#### Standard Column Types:

**1. Checkbox Column (Selection)**
```javascript
{
    selectable: true,
    width: 50,
    headerTemplate: '<input type="checkbox" id="selectAll" />',
    attributes: { class: "bd-grid-checkbox-cell" }
}
```

**2. Text Column**
```javascript
{
    field: "fullName",
    title: "Full Name",
    width: 200,
    template: (data) => `
        <div class="bd-grid-text-cell">
            <span class="bd-grid-cell-primary">${data.fullName}</span>
            <span class="bd-grid-cell-secondary">${data.email}</span>
        </div>
    `
}
```

**3. Status Badge Column**
```javascript
{
    field: "status",
    title: "Status",
    width: 120,
    template: (data) => {
        const statusMap = {
            'Active': 'success',
            'Inactive': 'secondary',
            'Pending': 'warning',
            'Deleted': 'danger'
        };
        const variant = statusMap[data.status] || 'secondary';
        return `<span class="bd-badge bd-badge-${variant}">${data.status}</span>`;
    },
    filterable: {
        mode: "menu",
        ui: function(element) {
            element.kendoDropDownList({
                dataSource: ['Active', 'Inactive', 'Pending', 'Deleted'],
                optionLabel: "All"
            });
        }
    }
}
```

**4. Date Column**
```javascript
{
    field: "createdAt",
    title: "Created",
    width: 140,
    format: "{0:dd MMM yyyy}",
    filterable: {
        ui: "datepicker"
    }
}
```

**5. Actions Column**
```javascript
{
    title: "Actions",
    width: 120,
    template: (data) => `
        <div class="bd-grid-actions">
            <button class="bd-btn bd-btn--icon bd-btn--ghost"
                    onclick="editRecord(${data.id})"
                    title="Edit"
                    data-permission="CRM.Lead.Update">
                <i class="k-icon k-i-edit"></i>
            </button>
            <button class="bd-btn bd-btn--icon bd-btn--ghost bd-btn--danger"
                    onclick="deleteRecord(${data.id})"
                    title="Delete"
                    data-permission="CRM.Lead.Delete">
                <i class="k-icon k-i-delete"></i>
            </button>
        </div>
    `,
    filterable: false,
    sortable: false
}
```

### 2.6 Grid Row Behaviors

#### Row Hover Highlight
```css
.k-grid tbody tr:hover {
    background-color: var(--bd-surface-hover);
    cursor: pointer;
}
```

#### Row Selection
```css
.k-grid tbody tr.k-selected {
    background-color: var(--bd-primary-light);
    color: var(--bd-primary-dark);
}
```

#### Double-Click to Edit
```javascript
// Grid configuration
change: function(e) {
    const grid = this;
    const selectedRow = grid.select();
    if (selectedRow.length > 0) {
        const dataItem = grid.dataItem(selectedRow);
        // Store selected item ID for context menu
        grid.element.data('selectedId', dataItem.id);
    }
},
dataBound: function(e) {
    const grid = this;
    grid.tbody.on('dblclick', 'tr', function(e) {
        const dataItem = grid.dataItem(this);
        editRecord(dataItem.id);
    });
}
```

#### Right-Click Context Menu
```javascript
// Context menu configuration
const contextMenuItems = [
    {
        text: "👁 View Details",
        icon: "k-i-preview",
        action: "view",
        permission: "CRM.Lead.View"
    },
    {
        text: "✏️ Edit",
        icon: "k-i-edit",
        action: "edit",
        permission: "CRM.Lead.Update"
    },
    { separator: true },
    {
        text: "📋 Copy",
        icon: "k-i-copy",
        action: "copy"
    },
    {
        text: "📌 Pin to Top",
        icon: "k-i-pin",
        action: "pin"
    },
    { separator: true },
    {
        text: "📤 Export Row",
        icon: "k-i-download",
        action: "exportRow",
        permission: "CRM.Lead.Export"
    },
    {
        text: "🔗 Copy Link",
        icon: "k-i-link-horizontal",
        action: "copyLink"
    },
    { separator: true },
    {
        text: "🗑 Delete",
        icon: "k-i-delete",
        action: "delete",
        permission: "CRM.Lead.Delete",
        cssClass: "danger" // Red text
    }
];

// Context menu initialization
grid.tbody.on('contextmenu', 'tr', function(e) {
    e.preventDefault();
    const dataItem = grid.dataItem(this);
    showContextMenu(e.pageX, e.pageY, dataItem, contextMenuItems);
});
```

### 2.7 Grid Empty State

```html
<!-- _EmptyState.cshtml -->
<div class="bd-empty-state">
    <div class="bd-empty-state__icon">
        <i class="k-icon k-i-@Model.Icon"></i>
    </div>
    <h3 class="bd-empty-state__title">@Model.Title</h3>
    <p class="bd-empty-state__description">@Model.Description</p>
    @if (Model.ShowAction)
    {
        <button class="bd-btn bd-btn-primary" onclick="@Model.ActionHandler">
            <i class="k-icon k-i-plus"></i>
            @Model.ActionText
        </button>
    }
</div>
```

**CSS:**
```css
.bd-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--bd-space-6) var(--bd-space-4);
    min-height: 400px;
    text-align: center;
}

.bd-empty-state__icon {
    font-size: 64px;
    color: var(--bd-text-muted);
    margin-bottom: var(--bd-space-4);
}

.bd-empty-state__title {
    font-size: var(--bd-font-xl);
    font-weight: 600;
    color: var(--bd-text);
    margin-bottom: var(--bd-space-2);
}

.bd-empty-state__description {
    font-size: var(--bd-font-base);
    color: var(--bd-text-secondary);
    max-width: 400px;
    margin-bottom: var(--bd-space-4);
}
```

### 2.8 Grid Bulk Actions

#### Bulk Toolbar (Shows when rows selected)
```html
<div id="bulkToolbar" class="bd-bulk-toolbar" style="display:none;">
    <div class="bd-bulk-toolbar__info">
        <i class="k-icon k-i-check-circle"></i>
        <span id="bulkCount">0</span> selected
    </div>
    <div class="bd-bulk-toolbar__actions">
        <button class="bd-btn bd-btn--sm bd-btn-secondary" onclick="bulkEdit()">
            <i class="k-icon k-i-edit"></i> Edit
        </button>
        <button class="bd-btn bd-btn--sm bd-btn-secondary" onclick="bulkExport()">
            <i class="k-icon k-i-download"></i> Export
        </button>
        <button class="bd-btn bd-btn--sm bd-btn-danger" onclick="bulkDelete()">
            <i class="k-icon k-i-delete"></i> Delete
        </button>
        <button class="bd-btn bd-btn--sm bd-btn-ghost" onclick="clearSelection()">
            <i class="k-icon k-i-close"></i> Clear
        </button>
    </div>
</div>
```

**JavaScript:**
```javascript
// Handle selection change
change: function(e) {
    const grid = this;
    const selectedRows = grid.select();
    const count = selectedRows.length;

    if (count > 0) {
        $('#bulkToolbar').show();
        $('#bulkCount').text(count);
    } else {
        $('#bulkToolbar').hide();
    }
}
```

### 2.9 Grid Export Functions

#### Excel Export
```javascript
function exportToExcel() {
    const grid = $('#grid').data('kendoGrid');
    grid.saveAsExcel({
        fileName: `Leads_${new Date().toISOString().split('T')[0]}.xlsx`,
        filterable: true,
        allPages: true
    });
}
```

#### PDF Export
```javascript
function exportToPDF() {
    const grid = $('#grid').data('kendoGrid');
    grid.saveAsPDF({
        fileName: `Leads_${new Date().toISOString().split('T')[0]}.pdf`,
        paperSize: "A4",
        landscape: true,
        margin: { top: "1cm", left: "1cm", right: "1cm", bottom: "1cm" },
        scale: 0.8
    });
}
```

#### CSV Export (Custom)
```javascript
function exportToCSV() {
    const grid = $('#grid').data('kendoGrid');
    const data = grid.dataSource.data();

    // Build CSV
    const headers = grid.columns.map(col => col.title).join(',');
    const rows = data.map(item => {
        return grid.columns.map(col => {
            const value = item[col.field] || '';
            return `"${value}"`;
        }).join(',');
    });

    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}
```

---

## 3. Form Component

### 3.1 Form Anatomy

```html
┌──────────────────────────────────────────────────────┐
│ FORM HEADER                                          │
│ ┌────────────────────────────────────────────────┐  │
│ │ Create New Lead                              × │  │
│ └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│ FORM BODY                                            │
│ ┌────────────────────────────────────────────────┐  │
│ │ Full Name *                                    │  │
│ │ ┌──────────────────────────────────────────┐   │  │
│ │ │ [Input field                            ]│   │  │
│ │ └──────────────────────────────────────────┘   │  │
│ │                                                │  │
│ │ Email *                                        │  │
│ │ ┌──────────────────────────────────────────┐   │  │
│ │ │ [Input field                            ]│   │  │
│ │ └──────────────────────────────────────────┘   │  │
│ │                                                │  │
│ │ Phone                                          │  │
│ │ ┌──────────────────────────────────────────┐   │  │
│ │ │ [Input field                            ]│   │  │
│ │ └──────────────────────────────────────────┘   │  │
│ └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│ FORM FOOTER                                          │
│ ┌────────────────────────────────────────────────┐  │
│ │                      [Cancel] [Save Lead]      │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 3.2 Form Layout Patterns

#### Single Column (Default)
```html
<div class="bd-form">
    <div class="bd-form-group">
        <label class="bd-label required">Full Name</label>
        <input type="text" class="bd-input" required />
        <span class="bd-field-error"></span>
    </div>

    <div class="bd-form-group">
        <label class="bd-label">Email</label>
        <input type="email" class="bd-input" />
    </div>
</div>
```

#### Two Column
```html
<div class="bd-form">
    <div class="bd-form-row">
        <div class="bd-form-group">
            <label class="bd-label required">First Name</label>
            <input type="text" class="bd-input" required />
        </div>

        <div class="bd-form-group">
            <label class="bd-label required">Last Name</label>
            <input type="text" class="bd-input" required />
        </div>
    </div>
</div>
```

**CSS:**
```css
.bd-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--bd-space-4);
}

@media (max-width: 768px) {
    .bd-form-row {
        grid-template-columns: 1fr; /* Stack on mobile */
    }
}
```

### 3.3 Form Field Types

#### Text Input
```html
<div class="bd-form-group">
    <label class="bd-label">Full Name</label>
    <input type="text" class="bd-input" placeholder="Enter full name" />
</div>
```

#### Kendo DatePicker
```html
<div class="bd-form-group">
    <label class="bd-label">Date of Birth</label>
    <input id="dateOfBirth" />
</div>

<script>
$('#dateOfBirth').kendoDatePicker({
    format: "dd MMM yyyy",
    max: new Date() // Can't select future dates
});
</script>
```

#### Kendo DropDownList
```html
<div class="bd-form-group">
    <label class="bd-label">Country</label>
    <select id="country"></select>
</div>

<script>
$('#country').kendoDropDownList({
    dataSource: {
        transport: {
            read: { url: '/api/countries', type: 'GET' }
        }
    },
    dataTextField: "name",
    dataValueField: "id",
    optionLabel: "Select Country"
});
</script>
```

#### Kendo ComboBox (Autocomplete)
```html
<div class="bd-form-group">
    <label class="bd-label">Assigned To</label>
    <input id="assignedTo" />
</div>

<script>
$('#assignedTo').kendoComboBox({
    dataSource: {
        transport: {
            read: { url: '/api/users', type: 'GET' }
        }
    },
    dataTextField: "fullName",
    dataValueField: "id",
    filter: "contains",
    minLength: 2,
    placeholder: "Type to search..."
});
</script>
```

#### Kendo MultiSelect
```html
<div class="bd-form-group">
    <label class="bd-label">Tags</label>
    <select id="tags" multiple></select>
</div>

<script>
$('#tags').kendoMultiSelect({
    dataSource: ['Hot', 'Warm', 'Cold', 'New', 'Follow-up'],
    placeholder: "Select tags"
});
</script>
```

#### Kendo NumericTextBox
```html
<div class="bd-form-group">
    <label class="bd-label">Budget</label>
    <input id="budget" />
</div>

<script>
$('#budget').kendoNumericTextBox({
    format: "c2", // Currency format
    min: 0,
    step: 1000,
    decimals: 2
});
</script>
```

#### Kendo Editor (Rich Text)
```html
<div class="bd-form-group">
    <label class="bd-label">Notes</label>
    <textarea id="notes"></textarea>
</div>

<script>
$('#notes').kendoEditor({
    tools: [
        "bold", "italic", "underline", "strikethrough",
        "justifyLeft", "justifyCenter", "justifyRight",
        "insertUnorderedList", "insertOrderedList",
        "createLink", "unlink"
    ],
    height: 200
});
</script>
```

### 3.4 Form Validation

#### Client-Side Validation (Kendo Validator)
```javascript
// Initialize validator
const validator = $('#leadForm').kendoValidator({
    rules: {
        bdEmail: function(input) {
            if (input.is('[data-bd-email]')) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.val());
            }
            return true;
        },
        bdPhone: function(input) {
            if (input.is('[data-bd-phone]')) {
                return /^01[3-9]\d{8}$/.test(input.val());
            }
            return true;
        }
    },
    messages: {
        required: "This field is required",
        bdEmail: "Please enter a valid email address",
        bdPhone: "Please enter a valid Bangladesh phone number (01XXXXXXXXX)"
    }
}).data('kendoValidator');

// Validate on submit
$('#saveButton').click(function(e) {
    if (validator.validate()) {
        // Submit form
        saveForm();
    } else {
        window.bdNotify.error('Please fix validation errors');
    }
});
```

#### Server-Side Validation Display
```javascript
// Display server validation errors
function displayServerErrors(errors) {
    for (const [field, messages] of Object.entries(errors)) {
        const $field = $(`[name="${field}"]`);
        const $error = $field.siblings('.bd-field-error');

        $field.addClass('bd-input--error');
        $error.text(messages.join(', ')).show();
    }
}
```

### 3.5 Form Guard (Unsaved Changes)

```javascript
// Track form dirty state
let isFormDirty = false;

$('#leadForm :input').on('change input', function() {
    isFormDirty = true;
});

// Warn on navigation
window.addEventListener('beforeunload', function(e) {
    if (isFormDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Clear dirty flag on successful save
function onSaveSuccess() {
    isFormDirty = false;
    window.bdNotify.success('Lead saved successfully');
}
```

---

## 4. Modal/Dialog Component

### 4.1 Modal Types

#### Type 1: Simple Confirmation Dialog
```javascript
window.bdModal.confirm({
    title: 'Delete Lead',
    message: 'Are you sure you want to delete this lead? This action cannot be undone.',
    confirmText: 'Delete',
    confirmClass: 'bd-btn-danger',
    onConfirm: function() {
        deleteLead(leadId);
    }
});
```

#### Type 2: Form Modal (Small)
```javascript
window.bdModal.open({
    title: 'Quick Add Lead',
    content: $('#quickAddForm').html(),
    size: 'small', // 400px
    actions: [
        {
            text: 'Cancel',
            cssClass: 'bd-btn-secondary',
            action: function() {
                this.close();
            }
        },
        {
            text: 'Save',
            cssClass: 'bd-btn-primary',
            action: function() {
                saveQuickLead();
            }
        }
    ]
});
```

#### Type 3: Full Page Form (Grid/Form Toggle)
*Not a modal - this is in-page toggle*
```javascript
// Show form, hide grid
window.bdShowForm('Edit Lead #123');

// Hide form, show grid
window.bdHideForm();
```

### 4.2 Modal Sizes

```javascript
const sizeMap = {
    'small': 400,
    'medium': 600,
    'large': 800,
    'xlarge': 1000,
    'fullscreen': '90%'
};
```

### 4.3 Modal Implementation

```javascript
// bd-modal.js wrapper around Kendo Window
window.bdModal = {
    open: function(options) {
        const modal = $('<div>').kendoWindow({
            title: options.title,
            width: options.size === 'fullscreen' ? '90%' : (options.width || 600),
            modal: true,
            actions: ['Close'],
            content: options.content,
            activate: function() {
                if (options.onOpen) options.onOpen(this);
            },
            close: function() {
                if (options.onClose) options.onClose(this);
                this.destroy();
            }
        }).data('kendoWindow');

        modal.center().open();
        return modal;
    },

    confirm: function(options) {
        const content = `
            <div class="bd-modal-confirm">
                <p>${options.message}</p>
            </div>
        `;

        return this.open({
            title: options.title || 'Confirm',
            content: content,
            size: 'small',
            actions: [
                {
                    text: options.cancelText || 'Cancel',
                    cssClass: 'bd-btn-secondary',
                    action: function() {
                        if (options.onCancel) options.onCancel();
                        this.close();
                    }
                },
                {
                    text: options.confirmText || 'Confirm',
                    cssClass: options.confirmClass || 'bd-btn-primary',
                    action: function() {
                        if (options.onConfirm) options.onConfirm();
                        this.close();
                    }
                }
            ]
        });
    }
};
```

---

## 5. Card Component

### 5.1 Basic Card
```html
<div class="bd-card">
    <div class="bd-card__body">
        <p>Card content here</p>
    </div>
</div>
```

### 5.2 Card with Header
```html
<div class="bd-card">
    <div class="bd-card__header">
        <h3 class="bd-card__title">Card Title</h3>
        <div class="bd-card__actions">
            <button class="bd-btn bd-btn--icon bd-btn--ghost">
                <i class="k-icon k-i-more-vertical"></i>
            </button>
        </div>
    </div>
    <div class="bd-card__body">
        <p>Card content here</p>
    </div>
</div>
```

### 5.3 Stat Card (Dashboard)
```html
<div class="bd-card bd-stat-card">
    <div class="bd-stat-card__icon bd-stat-card__icon--primary">
        <i class="k-icon k-i-user"></i>
    </div>
    <div class="bd-stat-card__content">
        <div class="bd-stat-card__label">Total Leads</div>
        <div class="bd-stat-card__value">1,245</div>
        <div class="bd-stat-card__change bd-stat-card__change--up">
            <i class="k-icon k-i-arrow-up"></i> 12.5% from last month
        </div>
    </div>
</div>
```

**CSS:**
```css
.bd-stat-card {
    display: flex;
    gap: var(--bd-space-4);
    padding: var(--bd-space-4);
}

.bd-stat-card__icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--bd-radius-lg);
    font-size: 32px;
}

.bd-stat-card__icon--primary {
    background-color: var(--bd-primary-light);
    color: var(--bd-primary);
}

.bd-stat-card__value {
    font-size: var(--bd-font-xl);
    font-weight: 700;
    color: var(--bd-text);
}

.bd-stat-card__change--up {
    color: var(--bd-success);
}
```

---

## 6. Button Component

### 6.1 Button Variants

```html
<!-- Primary (default action) -->
<button class="bd-btn bd-btn-primary">Save</button>

<!-- Secondary (cancel, back) -->
<button class="bd-btn bd-btn-secondary">Cancel</button>

<!-- Success -->
<button class="bd-btn bd-btn-success">Approve</button>

<!-- Danger (delete, remove) -->
<button class="bd-btn bd-btn-danger">Delete</button>

<!-- Warning -->
<button class="bd-btn bd-btn-warning">Warn</button>

<!-- Info -->
<button class="bd-btn bd-btn-info">Info</button>

<!-- Ghost (subtle) -->
<button class="bd-btn bd-btn-ghost">More</button>

<!-- Outline -->
<button class="bd-btn bd-btn-outline-primary">Outlined</button>
```

### 6.2 Button Sizes

```html
<!-- Small -->
<button class="bd-btn bd-btn--sm">Small</button>

<!-- Default -->
<button class="bd-btn">Default</button>

<!-- Large -->
<button class="bd-btn bd-btn--lg">Large</button>

<!-- Block (full width) -->
<button class="bd-btn bd-btn--block">Full Width</button>
```

### 6.3 Icon Buttons

```html
<!-- Icon only -->
<button class="bd-btn bd-btn--icon">
    <i class="k-icon k-i-edit"></i>
</button>

<!-- Icon + Text -->
<button class="bd-btn bd-btn-primary">
    <i class="k-icon k-i-plus"></i>
    New Lead
</button>

<!-- Loading state -->
<button class="bd-btn bd-btn-primary loading">
    <span class="bd-btn__loader k-icon k-i-loading"></span>
    <span class="bd-btn__text">Saving...</span>
</button>
```

**CSS:**
```css
.bd-btn--icon {
    width: 44px;
    height: 44px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.bd-btn.loading .bd-btn__text {
    opacity: 0.5;
}

.bd-btn__loader {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

---

## 7. Tab Component

### 7.1 Basic Tabs (Kendo TabStrip)

```html
<div id="tabstrip">
    <ul>
        <li class="k-active">General Information</li>
        <li>Contact Details</li>
        <li>Documents</li>
        <li>Activity Log</li>
    </ul>
    <div>
        <!-- Tab 1: General Information -->
        <div class="bd-tab-content">
            <form id="generalForm">
                <!-- Form fields -->
            </form>
        </div>
    </div>
    <div>
        <!-- Tab 2: Contact Details -->
        <div class="bd-tab-content">
            <!-- Content -->
        </div>
    </div>
    <div>
        <!-- Tab 3: Documents -->
        <div class="bd-tab-content">
            <!-- Content -->
        </div>
    </div>
    <div>
        <!-- Tab 4: Activity Log -->
        <div class="bd-tab-content">
            <!-- Timeline or list -->
        </div>
    </div>
</div>

<script>
$('#tabstrip').kendoTabStrip({
    animation: {
        open: {
            effects: "fadeIn"
        }
    },
    select: function(e) {
        const tabIndex = $(e.item).index();
        console.log('Tab switched to:', tabIndex);
    }
});
</script>
```

### 7.2 Tab with Badge (Count)

```html
<ul>
    <li class="k-active">
        General
    </li>
    <li>
        Documents <span class="bd-badge bd-badge-primary">5</span>
    </li>
    <li>
        Comments <span class="bd-badge bd-badge-warning">12</span>
    </li>
</ul>
```

---

## 8. Page Layout Standard

### 8.1 Standard Page Structure

```html
<!-- All pages follow this structure -->
<div class="bd-page">
    <!-- Page Header (breadcrumb + title + actions) -->
    @await Html.PartialAsync("_PageHeader", pageHeaderModel)

    <!-- Page Content -->
    <div class="bd-page-content">
        <!-- Grid, Form, Dashboard, or Custom Content -->
        @RenderBody()
    </div>
</div>
```

### 8.2 Page Header Component

```html
<!-- _PageHeader.cshtml -->
<div class="bd-page-header">
    <div class="bd-page-header__breadcrumb">
        <a href="/">Home</a>
        @foreach (var crumb in Model.Breadcrumbs)
        {
            <span class="bd-breadcrumb-separator">/</span>
            @if (crumb.IsActive)
            {
                <span>@crumb.Text</span>
            }
            else
            {
                <a href="@crumb.Url">@crumb.Text</a>
            }
        }
    </div>

    <div class="bd-page-header__main">
        <div class="bd-page-header__title">
            <h1>@Model.Title</h1>
            @if (!string.IsNullOrEmpty(Model.Subtitle))
            {
                <p class="bd-page-header__subtitle">@Model.Subtitle</p>
            }
        </div>

        @if (Model.Actions != null && Model.Actions.Any())
        {
            <div class="bd-page-header__actions">
                @foreach (var action in Model.Actions)
                {
                    <button class="bd-btn @action.CssClass" onclick="@action.Handler">
                        @if (!string.IsNullOrEmpty(action.Icon))
                        {
                            <i class="k-icon k-i-@action.Icon"></i>
                        }
                        @action.Text
                    </button>
                }
            </div>
        }
    </div>
</div>
```

**Model:**
```csharp
public class PageHeaderModel
{
    public string Title { get; set; }
    public string Subtitle { get; set; }
    public List<Breadcrumb> Breadcrumbs { get; set; } = new();
    public List<PageAction> Actions { get; set; } = new();
}

public class Breadcrumb
{
    public string Text { get; set; }
    public string Url { get; set; }
    public bool IsActive { get; set; }
}

public class PageAction
{
    public string Text { get; set; }
    public string Icon { get; set; }
    public string CssClass { get; set; } = "bd-btn-primary";
    public string Handler { get; set; }
}
```

---

## 9. Mobile-First Responsive Guidelines

### 9.1 Breakpoints

```css
/* Mobile First Approach */
:root {
    --bd-breakpoint-xs: 0;
    --bd-breakpoint-sm: 576px;   /* Small tablets */
    --bd-breakpoint-md: 768px;   /* Tablets */
    --bd-breakpoint-lg: 992px;   /* Laptops */
    --bd-breakpoint-xl: 1200px;  /* Desktops */
    --bd-breakpoint-xxl: 1400px; /* Large desktops */
}

/* Default styles are for mobile */
.bd-grid-toolbar {
    flex-direction: column;
    gap: var(--bd-space-2);
}

/* Then enhance for larger screens */
@media (min-width: 768px) {
    .bd-grid-toolbar {
        flex-direction: row;
    }
}
```

### 9.2 Touch Targets (Mobile)

```css
/* Minimum 44x44px for touch (Apple HIG) */
.bd-btn,
.bd-grid-actions button,
.k-button {
    min-width: 44px;
    min-height: 44px;
}

/* Larger spacing on mobile */
@media (max-width: 767px) {
    .bd-form-group {
        margin-bottom: var(--bd-space-4);
    }

    .bd-btn {
        padding: 12px 20px; /* Larger padding */
    }
}
```

### 9.3 Grid Responsive Patterns

#### Pattern 1: Horizontal Scroll
```css
.bd-grid-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Smooth iOS scroll */
}

.bd-grid-wrapper .k-grid {
    min-width: 600px; /* Force scroll on mobile */
}
```

#### Pattern 2: Sticky First Column
```css
@media (max-width: 767px) {
    .k-grid td:first-child,
    .k-grid th:first-child {
        position: sticky;
        left: 0;
        background: var(--bd-surface);
        z-index: 2;
        box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }
}
```

#### Pattern 3: Card View (Mobile Alternative)
```javascript
// Switch to card view on mobile
if (window.innerWidth < 768) {
    renderCardView(data);
} else {
    renderGridView(data);
}
```

**Card View HTML:**
```html
<div class="bd-grid-card">
    <div class="bd-grid-card__header">
        <h4>John Doe</h4>
        <span class="bd-badge bd-badge-success">Active</span>
    </div>
    <div class="bd-grid-card__body">
        <div class="bd-grid-card__row">
            <span class="label">Email:</span>
            <span class="value">john@example.com</span>
        </div>
        <div class="bd-grid-card__row">
            <span class="label">Phone:</span>
            <span class="value">01712345678</span>
        </div>
    </div>
    <div class="bd-grid-card__footer">
        <button class="bd-btn bd-btn--sm">Edit</button>
        <button class="bd-btn bd-btn--sm bd-btn-danger">Delete</button>
    </div>
</div>
```

### 9.4 Modal Responsive

```css
/* Mobile: Full screen modal */
@media (max-width: 767px) {
    .k-window {
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        border-radius: 0;
    }
}
```

### 9.5 Form Responsive

```css
/* Stack form rows on mobile */
.bd-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--bd-space-4);
}

@media (max-width: 768px) {
    .bd-form-row {
        grid-template-columns: 1fr; /* Single column */
    }
}
```

---

## 10. Component Usage Examples

### 10.1 Complete Grid Page Example

**View: /Views/Leads/Index.cshtml**
```html
@{
    ViewData["Title"] = "Leads";
    var pageHeader = new PageHeaderModel
    {
        Title = "Leads",
        Subtitle = "Manage your sales leads",
        Breadcrumbs = new List<Breadcrumb>
        {
            new() { Text = "Home", Url = "/", IsActive = false },
            new() { Text = "CRM", Url = "/crm", IsActive = false },
            new() { Text = "Leads", IsActive = true }
        },
        Actions = new List<PageAction>
        {
            new() { Text = "New Lead", Icon = "plus", Handler = "createLead()" }
        }
    };
}

@await Html.PartialAsync("_PageHeader", pageHeader)

<div class="bd-page-content">
    <div class="bd-grid-page">
        <div class="bd-grid-toolbar">
            <!-- Toolbar will be injected by bdGrid.create() -->
        </div>
        <div class="bd-grid-wrapper">
            <div id="leadGrid"></div>
        </div>
    </div>
</div>

@section Scripts {
<script>
(function() {
    'use strict';

    // Column configuration
    function getLeadGridColumns() {
        return [
            { selectable: true, width: 50 },
            {
                field: "fullName",
                title: "Name",
                width: 200,
                template: (d) => `
                    <div class="bd-grid-text-cell">
                        <span class="bd-grid-cell-primary">${d.fullName}</span>
                        <span class="bd-grid-cell-secondary">${d.email}</span>
                    </div>
                `
            },
            { field: "phone", title: "Phone", width: 150 },
            {
                field: "status",
                title: "Status",
                width: 120,
                template: (d) => `<span class="bd-badge bd-badge-${d.statusClass}">${d.status}</span>`
            },
            { field: "assignedTo", title: "Assigned To", width: 180 },
            {
                field: "createdAt",
                title: "Created",
                width: 140,
                format: "{0:dd MMM yyyy}"
            },
            {
                title: "Actions",
                width: 120,
                template: (d) => `
                    <div class="bd-grid-actions">
                        <button class="bd-btn bd-btn--icon bd-btn--ghost"
                                onclick="editLead(${d.id})" title="Edit">
                            <i class="k-icon k-i-edit"></i>
                        </button>
                        <button class="bd-btn bd-btn--icon bd-btn--ghost bd-btn--danger"
                                onclick="deleteLead(${d.id})" title="Delete">
                            <i class="k-icon k-i-delete"></i>
                        </button>
                    </div>
                `
            }
        ];
    }

    // Initialize grid
    const grid = window.bdGrid.create('#leadGrid', {
        dataUrl: '/api/crm/leads',
        columns: getLeadGridColumns(),
        pageSize: 20,
        toolbar: window.bdGridBase.getDefaultToolbar(),
        onNew: createLead,
        onEdit: editLead,
        onDelete: deleteLead
    });

    // CRUD functions
    window.createLead = function() {
        window.bdShowForm('Create New Lead');
    };

    window.editLead = function(id) {
        window.bdShowForm(`Edit Lead #${id}`);
        // Load lead data
        window.bdApi.get(`/api/crm/leads/${id}`)
            .done(function(response) {
                populateForm(response.data);
            });
    };

    window.deleteLead = function(id) {
        window.bdModal.confirm({
            title: 'Delete Lead',
            message: 'Are you sure you want to delete this lead?',
            confirmText: 'Delete',
            confirmClass: 'bd-btn-danger',
            onConfirm: function() {
                window.bdApi.delete(`/api/crm/leads/${id}`)
                    .done(function() {
                        window.bdNotify.success('Lead deleted successfully');
                        grid.dataSource.read();
                    });
            }
        });
    };
})();
</script>
}
```

### 10.2 Complete Form Example

**Partial: /Views/Leads/_LeadForm.cshtml**
```html
<div class="bd-form">
    <form id="leadForm">
        <div class="bd-form-row">
            <div class="bd-form-group">
                <label class="bd-label required">First Name</label>
                <input type="text" name="firstName" class="bd-input" required />
                <span class="bd-field-error"></span>
            </div>

            <div class="bd-form-group">
                <label class="bd-label required">Last Name</label>
                <input type="text" name="lastName" class="bd-input" required />
                <span class="bd-field-error"></span>
            </div>
        </div>

        <div class="bd-form-group">
            <label class="bd-label required">Email</label>
            <input type="email" name="email" class="bd-input"
                   data-bd-email required />
            <span class="bd-field-error"></span>
        </div>

        <div class="bd-form-group">
            <label class="bd-label">Phone</label>
            <input type="tel" name="phone" class="bd-input"
                   data-bd-phone />
            <span class="bd-field-error"></span>
        </div>

        <div class="bd-form-row">
            <div class="bd-form-group">
                <label class="bd-label">Country</label>
                <select id="country" name="countryId"></select>
            </div>

            <div class="bd-form-group">
                <label class="bd-label">Source</label>
                <select id="source" name="sourceId"></select>
            </div>
        </div>

        <div class="bd-form-group">
            <label class="bd-label">Assigned To</label>
            <input id="assignedTo" name="assignedToId" />
        </div>

        <div class="bd-form-group">
            <label class="bd-label">Notes</label>
            <textarea id="notes" name="notes"></textarea>
        </div>
    </form>
</div>

<div class="bd-form-footer">
    <button class="bd-btn bd-btn-secondary" onclick="window.bdHideForm()">
        Cancel
    </button>
    <button class="bd-btn bd-btn-primary" onclick="saveLead()">
        <span class="bd-btn__text">Save Lead</span>
        <span class="bd-btn__loader k-icon k-i-loading" style="display:none"></span>
    </button>
</div>

<script>
(function() {
    'use strict';

    // Initialize Kendo widgets
    $('#country').kendoDropDownList({
        dataSource: {
            transport: { read: { url: '/api/countries', type: 'GET' } }
        },
        dataTextField: "name",
        dataValueField: "id",
        optionLabel: "Select Country"
    });

    $('#source').kendoDropDownList({
        dataSource: ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'],
        optionLabel: "Select Source"
    });

    $('#assignedTo').kendoComboBox({
        dataSource: {
            transport: { read: { url: '/api/users', type: 'GET' } }
        },
        dataTextField: "fullName",
        dataValueField: "id",
        filter: "contains",
        minLength: 2,
        placeholder: "Type to search..."
    });

    $('#notes').kendoEditor({
        tools: ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList"],
        height: 150
    });

    // Initialize validator
    const validator = $('#leadForm').kendoValidator({
        rules: {
            bdEmail: function(input) {
                if (input.is('[data-bd-email]')) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.val());
                }
                return true;
            },
            bdPhone: function(input) {
                if (input.is('[data-bd-phone]')) {
                    if (!input.val()) return true; // Optional field
                    return /^01[3-9]\d{8}$/.test(input.val());
                }
                return true;
            }
        },
        messages: {
            required: "This field is required",
            bdEmail: "Please enter a valid email address",
            bdPhone: "Please enter a valid Bangladesh phone number"
        }
    }).data('kendoValidator');

    // Save function
    window.saveLead = function() {
        if (!validator.validate()) {
            window.bdNotify.error('Please fix validation errors');
            return;
        }

        const formData = {
            firstName: $('[name="firstName"]').val(),
            lastName: $('[name="lastName"]').val(),
            email: $('[name="email"]').val(),
            phone: $('[name="phone"]').val(),
            countryId: $('#country').data('kendoDropDownList').value(),
            source: $('#source').data('kendoDropDownList').value(),
            assignedToId: $('#assignedTo').data('kendoComboBox').value(),
            notes: $('#notes').data('kendoEditor').value()
        };

        // Show loading
        $('.bd-btn-primary .bd-btn__text').hide();
        $('.bd-btn-primary .bd-btn__loader').show();

        window.bdApi.post('/api/crm/leads', formData)
            .done(function(response) {
                window.bdNotify.success('Lead saved successfully');
                window.bdHideForm();
                $('#leadGrid').data('kendoGrid').dataSource.read();
            })
            .fail(function(xhr) {
                if (xhr.status === 400 && xhr.responseJSON.errors) {
                    displayServerErrors(xhr.responseJSON.errors);
                }
            })
            .always(function() {
                $('.bd-btn-primary .bd-btn__text').show();
                $('.bd-btn-primary .bd-btn__loader').hide();
            });
    };

    function displayServerErrors(errors) {
        for (const [field, messages] of Object.entries(errors)) {
            const $field = $(`[name="${field}"]`);
            const $error = $field.siblings('.bd-field-error');

            $field.addClass('bd-input--error');
            $error.text(messages.join(', ')).show();
        }
    }
})();
</script>
```

---

## Conclusion

এই document এ আপনার **30+ module, enterprise-level** project এর জন্য **সম্পূর্ণ UI/UX component guide** দেওয়া হয়েছে।

**Key Takeaways:**
1. ✅ সব component **Kendo jQuery 2024 Q4** based
2. ✅ সব component **reusable** - একবার define, everywhere use
3. ✅ **Mobile-first responsive** design
4. ✅ **Permission-based** visibility
5. ✅ **Consistent** design language across all 30+ modules

**Next Steps:**
1. এই patterns follow করে **Employee module** complete করুন
2. **Lead module** এ same pattern apply করুন
3. Remaining 27+ modules এ copy-paste করুন

আপনার কোন specific component নিয়ে প্রশ্ন থাকলে জানান! 🚀
