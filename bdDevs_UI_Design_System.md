# <a name="bddevcrm-ui-design-system-v2.0"></a>**📘 bdDevs — UI Design System v2.0**
**Version:** 2.0\
**Last Updated:** 2026-03-28\
**Author:** devSakhawat (Solo Developer)\
**Scope:** Enterprise CRM + HR/Payroll Platform — Full UI Standard\
**Applies to:** All modules (CRM, HR, Admin, Reporting)\
**Tech Stack:** ASP.NET Core MVC + Kendo UI (jQuery) + TypeScript + esbuild

-----
## <a name="table-of-contents"></a>**📑 Table of Contents**
1. [Purpose & Vision](#xae8e451a125f93c3bead34d6ddddcc04f2dd8b5)
1. [Design Principles](#x1534150ea58cbfe048d58a0a709e01516c53c78)
1. [Tech Architecture — Frontend](#xad0012f76039b7daa005dda52898021c8492bde)
1. [Design Tokens](#xbc94aa1ade106f7076ca81e0f7b263f7ad116c7)
1. [Component Standards](#x8b0692f4d9ad5b837ede8e16e91b34136af912e)
1. [Grid UX Standard](#x2197029d44f2c72ce06684007512f26fd9eb4bc)
1. [Form UX Standard](#xc7924b2886e2f2235ab3ee1b6fed488e2fe49e4)
1. [Interaction Rules](#xdf44d5741b93d21307e1b8c0c5d5b48004be250)
1. [Navigation UX](#xaf20de50f42be6560aac81ec74babacd5d60c2e)
1. [Empty State & Skeleton](#x87644a9d824f9db3572cde93ab6e3d4e3bd2a90)
1. [Responsive Rules](#x9c016399ffee962ff1cc128ad35bb35958c05b4)
1. [Permission UX](#xc06f967b52e1d1ca45b131760146d9dd2933684)
1. [Error UX](#x8915beb77d6c8897beeeae992459616cdcd7a71)
1. [Naming Convention](#x24e2da5dac0fa6f71a4dab5963ff743bb0d0a0c)
1. [Implementation Status & Gap Analysis](#xa5d15a9b24ee0b4ae2d477c5454111a37ab1d87)
1. [Implementation Roadmap](#x55f8b27ecce10ea3718c7dfb96312b18b32180f)
1. [File Architecture Reference](#xed9ec809afe76add1721aade763be5c9e4f0326)
1. [Decision Log](#x4268f150a9d97efbac4d17dcfb9876ad9273331)
-----
## <a name="purpose-vision"></a>**1. Purpose & Vision**
### <a name="কন-এই-document"></a>**1.1 কেন এই Document?**
এই document হলো bdDevs-এর **Single Source of Truth** — UI related সব সিদ্ধান্ত, pattern, standard এখানে documented। ভবিষ্যতে যেকোনো সময় ফিরে এসে বুঝতে পারবেন:

- **কী করছি** → বর্তমান implementation status
- **কেন করছি** → প্রতিটি decision-এর পেছনের কারণ
- **Destination কোথায়** → Phase-wise roadmap ও priority
### <a name="vision"></a>**1.2 Vision**
**“Enterprise-grade CRM UI — Clean, Fast, Consistent”**

- Solo developer হিসেবে যেন maintain করা সহজ হয়
- প্রতিটি module-এ same UI pattern follow হয়
- Future developer join করলে এই document পড়ে শুরু করতে পারে
- Phase 1 → Phase 3+ পর্যন্ত একটি consistent experience
### <a name="target-user"></a>**1.3 Target User**
- **অভিজ্ঞ office user** — CRM/ERP ব্যবহারে অভ্যস্ত
- Speed ও keyboard shortcut পছন্দ করে
- Mobile-তে occasionally দেখে, কিন্তু primary device = Desktop
-----
## <a name="design-principles"></a>**2. Design Principles**
### <a name="core-principles"></a>**2.1 Core Principles**

|#|Principle|Rule|Example|
| :- | :- | :- | :- |
|1|**Consistency First**|Same action = same UI behavior everywhere|Save button সবসময় নীল, সবসময় ডানে|
|2|**Speed + Clarity**|User 3 sec-এ বুঝে ফেলে কী করতে হবে|Clear labels, obvious buttons, no clutter|
|3|**Feedback Always**|Every action → visible response, no dead click|Toast on save, spinner on load, confirm on delete|
|4|**Enterprise Feel**|Clean, minimal, structured — not colorful/playful|Muted colors, consistent spacing, professional look|
|5|**Keyboard First**|Power user keyboard shortcut support|Ctrl+S save, Ctrl+K palette, Esc close|
### <a name="কন-এই-principles"></a>**2.2 কেন এই Principles?**
- **Consistency** → Solo developer — ভবিষ্যতে code maintain করতে সহজ হবে, নতুন module-এ guess করতে হবে না
- **Speed** → CRM user দিনে 100+ record handle করে — UI যত fast, user তত productive
- **Feedback** → Enterprise user-এর trust অর্জন করতে হয় — “আমার click কাজ করেছে কিনা” এটা 100% clear হতে হবে
- **Enterprise Feel** → Client-এ deploy করলে professional look দরকার — playful UI = credibility হারায়
- **Keyboard** → Power users mouse avoid করে — keyboard support = respect for their workflow
-----
## <a name="tech-architecture-frontend"></a>**3. Tech Architecture — Frontend**
### <a name="typescript-esbuild-bundle-pipeline"></a>**3.1 TypeScript → esbuild → Bundle Pipeline**
ts-src/ (TypeScript source — YOU WRITE HERE)\
`    `↓ npm run build / watch\
`    `↓ esbuild (IIFE format, ES2020 target)\
`    `↓\
wwwroot/js/dist/bundle.js (compiled output → browser loads this)\
`    `↓\
\_Layout.cshtml loads bundle.js → window globals available\
`    `↓\
Razor <script> sections use: window.bdApi, window.bdTheme, etc.
### <a name="কন-এই-architecture"></a>**3.2 কেন এই Architecture?**

|Decision|Why|
| :- | :- |
|TypeScript, not plain JS|Type safety — compile-time error catch, IntelliSense|
|esbuild, not webpack|100x faster build, zero config complexity|
|IIFE format|Browser global — Razor views থেকে সরাসরি window.bdApi.get() call|
|Single bundle.js|One file load, no module resolution overhead in browser|
|window.\* globals|Kendo jQuery widgets + Razor script sections দুটোতেই সরাসরি ব্যবহার|
### <a name="folder-structure"></a>**3.3 Folder Structure**
ts-src/\
├── bundle.ts              ← Single entry point (সব import + window.\* expose)\
├── types/                 ← Type definitions ONLY (no logic)\
│   ├── api.types.ts       ← ApiResponse<T>, GridResult<T>, PaginationMetadata\
│   ├── grid.types.ts      ← GridRequestOptions, GridSort, GridFilter\
│   ├── theme.types.ts     ← ThemeFamily, ThemeMode, ThemeDensity\
│   └── ui.types.ts        ← ToastOptions, ModalOptions, NotificationItem\
├── core/                  ← Low-level services (no UI/DOM dependency)\
│   ├── api-service.ts     ← HTTP fetch wrapper + token + grid()\
│   ├── event-bus.ts       ← Pub/Sub event system\
│   ├── loading.ts         ← 3-level loading (app → page → component)\
│   └── toast.ts           ← Toast notification service\
├── services/              ← Business-level services (uses core/)\
│   ├── navigation-service.ts  ← ROUTE\_MAP, breadcrumb, active menu sync\
│   ├── theme-service.ts       ← 3-layer theme management\
│   ├── auth-service.ts        ← Token/session management\
│   ├── grid-service.ts        ← Kendo Grid wrapper (server-side)\
│   └── menu-service.ts        ← Sidebar menu API integration\
└── components/            ← UI components (manipulates DOM)\
`    `├── theme-picker.ts    ← Theme family/mode/density picker\
`    `├── bd-modal.ts        ← Kendo Window generic wrapper\
`    `├── command-palette.ts ← Ctrl+K search palette\
`    `├── notification-center.ts ← Bell notification drawer\
`    `└── form-guard.ts      ← Form dirty check + beforeunload
### <a name="window-globals-exposed-by-bundle.ts"></a>**3.4 Window Globals (exposed by bundle.ts)**
window.bdApi       → BdApiService     (HTTP fetch, grid, CRUD)\
window.bdToast     → ToastService     (success/error/warning/info)\
window.bdLoading   → LoadingService   (app/page/component loading)\
window.bdNav       → NavigationService (route resolve, breadcrumb)\
window.bdTheme     → ThemeService     (family + mode + density **switch**)\
window.eventBus    → EventBus         (pub/sub across components)\
window.bdEvents    → Events constants (event name constants)\
\
*// Future (when TS implemented):*\
window.bdModal     → ModalService     (Kendo Window wrapper)\
window.bdFormGuard → FormGuardService (dirty check)\
window.bdGrid      → GridService      (Kendo Grid factory)\
window.bdAuth      → AuthService      (session/token management)

-----
## <a name="design-tokens"></a>**4. Design Tokens**
### <a name="কন-design-tokens"></a>**4.1 কেন Design Tokens?**
Design Token = CSS variable হিসেবে define করা spacing, color, font — পুরো UI তে reuse হয়।\
**Random margin: 13px বা color: #3a7bd5 কোথাও লেখা যাবে না।**
### <a name="spacing-system"></a>**4.2 Spacing System**
***:root*** {\
`  `--bd-space-0: 0;\
`  `--bd-space-1: 4px;    */\* tight — icon gap \*/*\
`  `--bd-space-2: 8px;    */\* button padding, inline gap \*/*\
`  `--bd-space-3: 12px;   */\* grid cell padding, small gap \*/*\
`  `--bd-space-4: 16px;   */\* card padding, section gap \*/*\
`  `--bd-space-5: 20px;   */\* medium section gap \*/*\
`  `--bd-space-6: 24px;   */\* large section gap \*/*\
`  `--bd-space-7: 32px;   */\* page-level gap \*/*\
`  `--bd-space-8: 40px;   */\* hero/header spacing \*/*\
}

**Usage Rules:**

|Context|Token|
| :- | :- |
|Icon-to-text gap|space-1 (4px)|
|Button padding (horizontal)|space-3 (12px)|
|Button padding (vertical)|space-2 (8px)|
|Card inner padding|space-4 (16px)|
|Grid cell padding|space-3 (12px)|
|Section gap (between cards)|space-6 (24px)|
|Page content padding|space-7 (32px)|
|Form field gap|space-4 (16px)|
|Form row gap|space-5 (20px)|
### <a name="typography-system"></a>**4.3 Typography System**
***:root*** {\
`  `*/\* Font Sizes \*/*\
`  `--bd-text-xs: 12px;    */\* badges, timestamps \*/*\
`  `--bd-text-sm: 13px;    */\* labels, table text, hints \*/*\
`  `--bd-text-base: 14px;  */\* body text, input text — DEFAULT \*/*\
`  `--bd-text-md: 16px;    */\* sub-headings \*/*\
`  `--bd-text-lg: 18px;    */\* section titles \*/*\
`  `--bd-text-xl: 20px;    */\* page titles (small) \*/*\
`  `--bd-text-2xl: 24px;   */\* page titles (large) \*/*\
\
`  `*/\* Font Weights \*/*\
`  `--bd-fw-normal: 400;   */\* body text \*/*\
`  `--bd-fw-medium: 500;   */\* labels, table headers \*/*\
`  `--bd-fw-semibold: 600; */\* headings, button text \*/*\
\
`  `*/\* Line Heights \*/*\
`  `--bd-lh-tight: 1.25;\
`  `--bd-lh-normal: 1.5;\
`  `--bd-lh-relaxed: 1.75;\
\
`  `*/\* Font Family \*/*\
`  `--bd-font-sans: 'Inter', 'Segoe UI', -apple-system, sans-serif;\
`  `--bd-font-mono: 'JetBrains Mono', 'Fira Code', monospace;\
}
### <a name="color-system"></a>**4.4 Color System**
#### <a name="light-mode-default"></a>*Light Mode (Default)*
***:root***, [data-theme-mode="light"] {\
`  `*/\* Brand / Primary \*/*\
`  `--bd-primary: #0062cc;\
`  `--bd-primary-hover: #0052a3;\
`  `--bd-primary-light: #e8f0fe;    */\* selected row bg, subtle highlight \*/*\
`  `--bd-primary-text: #ffffff;      */\* text on primary bg \*/*\
\
`  `*/\* Semantic \*/*\
`  `--bd-success: #16a34a;\
`  `--bd-success-light: #dcfce7;\
`  `--bd-warning: #f59e0b;\
`  `--bd-warning-light: #fef3c7;\
`  `--bd-danger: #dc2626;\
`  `--bd-danger-light: #fee2e2;\
`  `--bd-info: #0ea5e9;\
`  `--bd-info-light: #e0f2fe;\
\
`  `*/\* Neutral / Surface \*/*\
`  `--bd-bg: #f8fafc;                */\* page background \*/*\
`  `--bd-surface: #ffffff;           */\* card, form, modal background \*/*\
`  `--bd-surface-hover: #f1f5f9;    */\* row hover, list hover \*/*\
`  `--bd-border: #e5e7eb;           */\* all borders \*/*\
`  `--bd-border-strong: #d1d5db;    */\* focused input border \*/*\
`  `--bd-divider: #f3f4f6;          */\* subtle dividers \*/*\
\
`  `*/\* Text \*/*\
`  `--bd-text-primary: #111827;      */\* main text \*/*\
`  `--bd-text-secondary: #6b7280;   */\* labels, descriptions \*/*\
`  `--bd-text-muted: #9ca3af;       */\* placeholder, disabled \*/*\
`  `--bd-text-inverse: #ffffff;      */\* text on dark bg \*/*\
}
#### <a name="dark-mode"></a>*Dark Mode*
[data-theme-mode="dark"] {\
`  `--bd-primary: #3b82f6;           */\* brighter blue for dark bg \*/*\
`  `--bd-primary-hover: #2563eb;\
`  `--bd-primary-light: #1e3a5f;\
`  `--bd-primary-text: #ffffff;\
\
`  `--bd-success: #22c55e;\
`  `--bd-success-light: #052e16;\
`  `--bd-warning: #fbbf24;\
`  `--bd-warning-light: #422006;\
`  `--bd-danger: #ef4444;\
`  `--bd-danger-light: #450a0a;\
`  `--bd-info: #38bdf8;\
`  `--bd-info-light: #0c2d48;\
\
`  `--bd-bg: #0f172a;\
`  `--bd-surface: #1e293b;\
`  `--bd-surface-hover: #334155;\
`  `--bd-border: #334155;\
`  `--bd-border-strong: #475569;\
`  `--bd-divider: #1e293b;\
\
`  `--bd-text-primary: #f1f5f9;\
`  `--bd-text-secondary: #94a3b8;\
`  `--bd-text-muted: #64748b;\
`  `--bd-text-inverse: #0f172a;\
}
#### <a name="color-usage-rules"></a>*Color Usage Rules*

|Usage|Color|❌ Never|
| :- | :- | :- |
|Primary action (Save, Submit, Confirm)|--bd-primary|Other actions তে primary ব্যবহার না|
|Delete / Destructive ONLY|--bd-danger|Warning তে danger ব্যবহার না|
|Status: Active / Complete|--bd-success|Random green ব্যবহার না|
|Status: Pending / Attention|--bd-warning||
|Info / Tips|--bd-info||
|All borders|--bd-border|Random gray ব্যবহার না|
|Page background|--bd-bg|#f5f5f5 বা যেকোনো random color না|
### <a name="elevation-shadow-system"></a>**4.5 Elevation / Shadow System**
***:root*** {\
`  `--bd-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);\
`  `--bd-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);\
`  `--bd-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.12);\
`  `--bd-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.15);\
}

|Element|Shadow|Why|
| :- | :- | :- |
|Cards|sm|Subtle lift from page|
|Dropdowns, Popovers|md|Floating above content|
|Modals|lg|Clear separation from page|
|Context menu|md|Floating menu|
|Toast|lg|Attention-grabbing|
### <a name="border-radius"></a>**4.6 Border Radius**
***:root*** {\
`  `--bd-radius-sm: 4px;    */\* badges, small elements \*/*\
`  `--bd-radius-md: 6px;    */\* buttons, inputs \*/*\
`  `--bd-radius-lg: 8px;    */\* cards, modals \*/*\
`  `--bd-radius-xl: 12px;   */\* large containers \*/*\
`  `--bd-radius-full: 999px; */\* avatar, circular badges \*/*\
}
### <a name="transitions"></a>**4.7 Transitions**
***:root*** {\
`  `--bd-transition-fast: 0.15s ease;\
`  `--bd-transition-base: 0.2s ease;\
`  `--bd-transition-slow: 0.3s ease;\
}

**Rules:** - Hover effects → fast - Sidebar collapse, modal open → base - Page transitions → slow - **No heavy animation** — fast & subtle always

-----
## <a name="component-standards"></a>**5. Component Standards**
### <a name="buttons"></a>**5.1 Buttons**
#### <a name="types-usage"></a>*Types & Usage*

|Type|CSS Class|Usage|Color|
| :- | :- | :- | :- |
|Primary|.bd-btn-primary|Save, Submit, Confirm|--bd-primary bg|
|Secondary|.bd-btn-secondary|Cancel, Close, Back|--bd-border border, transparent bg|
|Ghost|.bd-btn-ghost|Toolbar actions, subtle actions|Transparent, text color only|
|Danger|.bd-btn-danger|Delete, Remove|--bd-danger bg|
|Link|.bd-btn-link|Inline text actions|Primary color, no border|
#### <a name="specs"></a>*Specs*
Height: 36px (default) / 28px (compact mode) / 44px (large)\
Padding: var(--bd-space-2) var(--bd-space-3)  →  8px 12px\
Border Radius: var(--bd-radius-md)  →  6px\
Font Size: var(--bd-text-base)  →  14px\
Font Weight: var(--bd-fw-semibold)  →  600\
Transition: var(--bd-transition-fast)
#### <a name="states"></a>*States*

|State|Visual|
| :- | :- |
|Default|Normal color|
|Hover|Darker shade / border appear|
|Active/Pressed|Even darker, slight scale(0.98)|
|Disabled|opacity: 0.5, cursor: not-allowed|
|Loading|Text hidden, spinner inside button|
#### <a name="rules"></a>*Rules*
- ✅ Primary button → **maximum 1 per visible area**
- ✅ Button group → Primary always rightmost
- ✅ Delete button → always has confirm dialog
- ❌ Never put 2 primary buttons side by side
- ❌ Never use danger color for non-destructive actions
### <a name="inputs"></a>**5.2 Inputs**
Height: 36px (default) / 28px (compact)\
Border: 1px solid var(--bd-border)\
Border Radius: var(--bd-radius-md)\
Font Size: var(--bd-text-base)\
Padding: var(--bd-space-2) var(--bd-space-3)\
Background: var(--bd-surface)
#### <a name="states-1"></a>*States*

|State|Visual|
| :- | :- |
|Default|--bd-border|
|Focus|--bd-primary border, light primary ring|
|Error|--bd-danger border + error message below|
|Disabled|--bd-bg background, --bd-text-muted|
|Read-only|Same as disabled but normal text color|
#### <a name="kendo-widgets-used"></a>*Kendo Widgets Used*

|Widget|Usage|
| :- | :- |
|kendo.ui.DropDownList|Select fields|
|kendo.ui.DatePicker|Date fields|
|kendo.ui.NumericTextBox|Number fields|
|kendo.ui.TextBox|Text fields|
|kendo.ui.TextArea|Multi-line text|
|kendo.ui.Switch|Boolean toggle|
### <a name="cards"></a>**5.3 Cards**
Background: var(--bd-surface)\
Border: 1px solid var(--bd-border)\
Border Radius: var(--bd-radius-lg)  →  8px\
Padding: var(--bd-space-4)  →  16px\
Shadow: var(--bd-shadow-sm)
### <a name="modals-kendo-window"></a>**5.4 Modals (Kendo Window)**
Max Width: 600px (small) / 800px (medium) / 1000px (large)\
Max Height: screen height - 40px\
Border Radius: var(--bd-radius-lg)\
Shadow: var(--bd-shadow-lg)\
Structure: Header + Scrollable Body + Sticky Footer\
Footer: [Cancel (secondary)]  [Save (primary)]

-----
## <a name="grid-ux-standard"></a>**6. Grid UX Standard**
### <a name="কন-custom-grid-pattern"></a>**6.1 কেন Custom Grid Pattern?**
Kendo DataSource transport ব্যবহার করি না — bdApi.grid() দিয়ে fetch করি।\
**Reason:** Full control, typed response, no Kendo transport magic, easier debugging.
### <a name="grid-architecture"></a>**6.2 Grid Architecture**
Page (Razor .cshtml)\
`  `↓ uses \_GridPageShell.cshtml template\
`  `↓ defines column config function\
`  `↓ calls window.bdGrid.create() or grid-base pattern\
`  `↓ bdApi.grid() fetches data\
`  `↓ Kendo Grid renders
### <a name="grid-toolbar-standard-for-all-grids"></a>**6.3 Grid Toolbar (Standard for ALL grids)**
┌───────────────────────────────────────────────────────┐\
│ [+ New]  [⋮ Export ▾]  │  🔍 Search...  │  [⟳ Refresh] │\
│                        │                │  [≡ Columns] │\
└───────────────────────────────────────────────────────┘

|Button|Type|Shortcut|Notes|
| :- | :- | :- | :- |
|+ New|Primary|—|Opens form (Type 3 toggle)|
|Export|Ghost dropdown|—|Excel, PDF, CSV options|
|Search|Input|Auto-focus?|Debounced 300ms|
|Refresh|Ghost icon|—|Reloads grid data|
|Column Chooser|Ghost icon|—|Show/hide columns|
### <a name="grid-features"></a>**6.4 Grid Features**

|Feature|Implementation|Status|
| :- | :- | :- |
|Server-side Paging|bdApi.grid() → skip/take|✅ Done in api-service.ts|
|Server-side Sort|Sort params in request|✅ Done|
|Server-side Filter|Filter params in request|✅ Done|
|Search (debounced)|300ms debounce, full-text|🔄 In grid-base.js|
|Row Selection|**Checkbox** (multi-select)|⏳ To implement|
|Row Hover|--bd-surface-hover background|⏳ CSS needed|
|Row Double Click|Opens edit form (Type 3)|🔄 In grid-base.js|
|Row Right Click|Context menu|⏳ To implement|
|Bulk Actions|Select multiple → toolbar actions|⏳ Phase 1B|
|Column Reorder|Drag-drop columns|⏳ Phase 2|
|Column Resize|Drag column border|✅ Kendo built-in|
|Frozen Columns|First column sticky|⏳ Phase 1B|
|Export|Excel / PDF / CSV|⏳ Phase 1B|
|Empty State|Custom illustration + CTA|⏳ To implement|
### <a name="grid-row-context-menu"></a>**6.5 Grid Row Context Menu**
Right-click on any grid row shows:

┌──────────────────────────┐\
│ 👁  View Details          │   → Single click also works\
│ ✏️  Edit                  │   → Opens Type 3 form or Modal\
│ ─────────────────────── │\
│ 📋  Copy                  │   → Copies row data\
│ 📌  Pin to Top            │   → Pins row (optional feature)\
│ ─────────────────────── │\
│ 📤  Export Row             │   → Export single row\
│ 🔗  Copy Link             │   → Copies record URL\
│ ─────────────────────── │\
│ 🗑  Delete            🔴  │   → ALWAYS last, ALWAYS red\
└──────────────────────────┘

**Rules:** - Items grouped by: **CRUD** → **Utility** → **Danger** (with separators) - Delete = always **last item**, always **red text** - Delete click → **Confirm modal** (never direct delete) - **Permission-based**: unauthorized items are **hidden** (not disabled) - **Module-specific items** can be added: - Lead grid: “Convert to Student”, “Assign to Agent” - Student grid: “Create Application”, “Send Email” - Invoice grid: “Mark as Paid”, “Send Reminder”
### <a name="grid-column-configuration-pattern"></a>**6.6 Grid Column Configuration Pattern**
প্রতিটি page-এর জন্য একটি **column config function** থাকবে:

*// Example: Lead grid columns*\
**function** getLeadGridColumns(): kendo.ui.GridColumn[] {\
`    `**return** [\
`        `{ selectable: **true**, width: 50 },  *// checkbox column*\
`        `{ field: "fullName", title: "Name", width: 200 },\
`        `{ field: "email", title: "Email", width: 220 },\
`        `{ field: "phone", title: "Phone", width: 150 },\
`        `{ field: "status", title: "Status", width: 120,\
`          `template: (d) **=>** `<span class="bd-badge bd-badge-${d.statusClass}">${d.status}</span>` },\
`        `{ field: "assignedTo", title: "Assigned To", width: 180 },\
`        `{ field: "createdAt", title: "Created", width: 140,\
`          `format: "{0:dd MMM yyyy}" },\
`    `];\
}
### <a name="grid-selected-row-color"></a>**6.7 Grid Selected Row Color**
*/\* Selected row \*/*\
.k-grid tr.k-selected {\
`    `**background-color**: var(--bd-primary-light);\
}\
\
*/\* Hover row \*/*\
.k-grid tr***:hover*** {\
`    `**background-color**: var(--bd-surface-hover);\
}

-----
## <a name="form-ux-standard"></a>**7. Form UX Standard**
### <a name="three-form-patterns"></a>**7.1 Three Form Patterns**

|Type|Pattern|When to Use|Example|
| :- | :- | :- | :- |
|**Type 1**|Kendo Window Modal|Simple/quick forms, ≤5 fields|Add Note, Quick Edit Status|
|**Type 2**|Kendo Grid Inline|Lookup/master tables|Country list, Status list|
|**Type 3**|Grid/Form Toggle|Complex multi-tab forms|Lead form, Student form|
### <a name="type-3-gridform-toggle-primary-pattern"></a>**7.2 Type 3 — Grid/Form Toggle (Primary Pattern)**
[Grid View — Visible]                [Form View — Hidden initially]\
┌─────────────────────┐              ┌─────────────────────────────┐\
│ Toolbar: [+ New]    │   ──click──→ │ Form Title: "New Lead"      │\
│ Grid rows...        │              │ ┌─ TabStrip ──────────────┐ │\
│                     │              │ │[Basic][Details][Activity]│ │\
│                     │              │ ├──────────────────────────┤ │\
│                     │              │ │ 2-column form fields     │ │\
│                     │              │ │ Label:  [Input        ]  │ │\
│                     │              │ │ Label:  [Input        ]  │ │\
│                     │              │ └──────────────────────────┘ │\
│                     │              │ ┌─ Sticky Save Bar ────────┐ │\
│                     │   ←──save──  │ │ [Cancel]        [Save]   │ │\
│                     │              │ └──────────────────────────┘ │\
└─────────────────────┘              └─────────────────────────────┘

**Toggle Functions:**

window.bdShowForm("New Lead");   *// Grid hide → Form show*\
window.bdShowGrid();             *// Form hide → Grid show + refresh*\
window.bdFormSaving(**true**);       *// Save button → spinner*\
window.bdFormSaving(**false**);      *// Spinner → normal*
### <a name="form-layout-rules"></a>**7.3 Form Layout Rules**
#### <a name="desktop-992px-2-column-grid"></a>*Desktop (≥ 992px): 2-Column Grid*
┌──────────────────────────────────────┐\
│ Label \*           │ Label             │\
│ [Input         ]  │ [Input         ]  │\
│                   │                   │\
│ Label \*           │ Label             │\
│ [Dropdown     ▾]  │ [Date Picker  📅] │\
│                   │                   │\
│ Label             │                   │\
│ [Textarea       ] │                   │\
│ [              ]  │                   │\
└──────────────────────────────────────┘
#### <a name="mobile-768px-1-column"></a>*Mobile (< 768px): 1-Column*
┌──────────────────┐\
│ Label \*           │\
│ [Input         ]  │\
│                   │\
│ Label \*           │\
│ [Input         ]  │\
│                   │\
│ Label             │\
│ [Dropdown     ▾]  │\
└──────────────────┘
### <a name="form-validation-rules"></a>**7.4 Form Validation Rules**

|Rule|Visual|Timing|
| :- | :- | :- |
|Required field|\* mark after label (red)|On blur + on submit|
|Field error|Red border + error message below field|On blur|
|Field success|Green border (optional)|After fixing error|
|Form-level error|Error banner at top of form|On submit|

Label \*\
┌─────────────────────────┐\
│ [Invalid input       ]  │ ← red border (--bd-danger)\
└─────────────────────────┘\
⚠ This field is required      ← red text, --bd-text-sm size
### <a name="save-behavior"></a>**7.5 Save Behavior**

|Feature|Implementation|
| :- | :- |
|Sticky save bar|Fixed at form bottom, always visible|
|Ctrl+S|Triggers save from anywhere in form|
|Disable while saving|Button shows spinner, disabled|
|Success|Toast “Saved successfully” + grid refresh|
|Error|Toast “Save failed” + field errors highlight|
|Dirty check|If form changed + user navigates away → confirm dialog|
### <a name="form-dirty-check-form-guard"></a>**7.6 Form Dirty Check (form-guard)**
User modifies form → form is "dirty"\
`    `↓\
User clicks sidebar menu / back button / closes tab\
`    `↓\
Confirm dialog: "You have unsaved changes. Discard?"\
`    `↓\
[Stay] → stays on form\
[Discard] → navigates away, loses changes

-----
## <a name="interaction-rules"></a>**8. Interaction Rules**
### <a name="loading-states-3-levels"></a>**8.1 Loading States (3 Levels)**

|Level|Where|UI|Duration|
| :- | :- | :- | :- |
|**App Load**|Full page first load|Skeleton overlay|Until DOMContentLoaded|
|**Page Load**|Navigation between pages|NProgress bar (top)|Until content loads|
|**Component**|Grid refresh, form save|Spinner inside component|Until API response|

**Rules:** - ❌ Never show blank white screen - ❌ Never use browser default spinner - ✅ Always skeleton or shimmer for data areas - ✅ Button click → spinner **inside** the button
### <a name="toast-notification-rules"></a>**8.2 Toast Notification Rules**

|Type|Color|Auto Dismiss|When|
| :- | :- | :- | :- |
|Success|--bd-success|3 seconds|Save, Create, Update, Delete success|
|Error|--bd-danger|5 seconds (or manual)|API error, validation error|
|Warning|--bd-warning|4 seconds|Permission warning, timeout warning|
|Info|--bd-info|3 seconds|Tips, status change|

**Position:** Top-right corner **Max visible:** 3 toasts stacked **Has:** Progress bar, close button, optional action button
### <a name="confirm-dialog-rules"></a>**8.3 Confirm Dialog Rules**

|Action|Dialog?|Message|
| :- | :- | :- |
|Delete single|✅ Yes|“Are you sure you want to delete [name]?”|
|Delete bulk|✅ Yes|“Delete [n] selected items?”|
|Discard form|✅ Yes|“You have unsaved changes. Discard?”|
|Navigate away|✅ Only if dirty|“Unsaved changes will be lost.”|
|Save|❌ No|Direct save, toast on success|
|Cancel form|❌ Only if dirty|Shows dirty check dialog|
### <a name="keyboard-shortcuts"></a>**8.4 Keyboard Shortcuts**

|Shortcut|Action|Scope|
| :- | :- | :- |
|Ctrl + S|Save current form|Form pages|
|Ctrl + K|Open command palette|Global|
|Escape|Close modal / form / palette|Global|
|Ctrl + N|New record (if on grid page)|Grid pages|
|Delete|Delete selected (with confirm)|Grid pages|
|F5 / Ctrl + R|Refresh grid|Grid pages|

-----
## <a name="navigation-ux"></a>**9. Navigation UX**
### <a name="sidebar"></a>**9.1 Sidebar**
┌──────────────────┐\
│ 🔍 Search menu...│  ← Filter menu items\
├──────────────────┤\
│ 📊 Dashboard     │  ← Active item: primary color bg\
│ ▶ CRM            │  ← Expandable group\
│   ├─ Leads       │\
│   ├─ Students    │\
│   └─ Applications│\
│ ▶ HR             │\
│   ├─ Employees   │\
│   └─ Attendance  │\
│ ▶ Admin          │\
│   ├─ Users       │\
│   ├─ Roles       │\
│   └─ Settings    │\
└──────────────────┘

|Feature|Status|
| :- | :- |
|Active item highlight|✅ Done (navigation-service.ts)|
|Collapse/expand groups|✅ Done (sidebar.js)|
|Search filter|✅ Done (sidebar.js)|
|Tooltip in collapsed mode|⏳ To implement|
|Permission-based filter|✅ Done (server-side menu filter)|
|Mobile overlay mode|✅ Done (layout.css)|
### <a name="breadcrumb"></a>**9.2 Breadcrumb**
Dashboard  >  CRM  >  Leads  >  John Doe\
(clickable)   (clickable)  (clickable)  (current — not clickable)

- Always visible below topbar
- Generated from ROUTE\_MAP in navigation-service.ts
- Dynamic routes registered via window.bdNav.register()
-----
## <a name="empty-state-skeleton"></a>**10. Empty State & Skeleton**
### <a name="empty-state-design"></a>**10.1 Empty State Design**
When grid has **zero records**:

┌──────────────────────────────────────┐\
│                                      │\
│          📋 (large icon, muted)      │\
│                                      │\
│       No leads found                 │  ← --bd-text-lg, --bd-text-primary\
│                                      │\
│   Create your first lead to get      │  ← --bd-text-base, --bd-text-secondary\
│   started with the CRM pipeline.     │\
│                                      │\
│        [+ Create New Lead]           │  ← Primary button\
│                                      │\
└──────────────────────────────────────┘

**Rules:** - Icon: relevant to the module (📋 leads, 👥 employees, 📄 invoices) - Title: short, clear - Description: helpful, guides user to action - CTA button: primary, creates new record - **Permission check**: if user can’t create, hide CTA button
### <a name="grid-skeleton-loading"></a>**10.2 Grid Skeleton Loading**
┌──────────────────────────────────────┐\
│ ████████  ████  ██████  ███  ██████ │  ← header shimmer\
├──────────────────────────────────────┤\
│ ██████    ███   █████   ██   █████  │  ← row shimmer\
│ ████████  ████  ██████  ███  ██████ │\
│ ██████    ███   █████   ██   █████  │\
│ ████████  ████  ██████  ███  ██████ │\
│ ██████    ███   █████   ██   █████  │\
└──────────────────────────────────────┘

- Grey shimmer animation (pulse)
- Shows 5-8 fake rows
- Replaces grid while loading
### <a name="form-skeleton-loading"></a>**10.3 Form Skeleton Loading**
┌──────────────────────────────────────┐\
│ ████             │ ████              │\
│ ██████████████   │ ██████████████    │\
│                  │                   │\
│ ████             │ ████              │\
│ ██████████████   │ ██████████████    │\
└──────────────────────────────────────┘

- Shows label + input placeholders
- Shimmer animation
-----
## <a name="responsive-rules"></a>**11. Responsive Rules**

|Breakpoint|Screen|Changes|
| :- | :- | :- |
|≥ 1200px (Desktop)|Full layout|All features, 2-col forms|
|992–1199px (Small Desktop)|Slight compress|Same layout, smaller padding|
|768–991px (Tablet)|Medium changes|Sidebar can collapse, forms still 2-col|
|< 768px (Mobile)|Major changes|See below|
### <a name="mobile-specific-changes"></a>**Mobile-specific Changes**

|Component|Mobile Behavior|
| :- | :- |
|Sidebar|Overlay mode (slide-in + backdrop)|
|Form layout|1-column|
|Buttons|Full-width if in form footer|
|Grid|Horizontal scroll, sticky first column|
|Toolbar|Stack vertically|
|Modal|Full screen|
|Context menu|Bottom sheet style|

-----
## <a name="permission-ux"></a>**12. Permission UX**
### <a name="rules-1"></a>**Rules**

|Scenario|UI|
| :- | :- |
|No permission to view page|Redirect to 403 page|
|No permission to create|“New” button **hidden** (not disabled)|
|No permission to edit|“Edit” in context menu **hidden**|
|No permission to delete|“Delete” button/menu **hidden**|
|Read-only permission|Form fields **disabled**, no save bar|

**Important:** Hidden > Disabled\
কারণ: Disabled দেখলে user মনে করে “এটা আমার জন্য কিন্তু কোনো কারণে কাজ করছে না” — frustrating। Hidden মানে user জানেই না feature টা আছে — no confusion।

**Exception:** যদি user-কে জানাতে হয় যে “এই feature আছে কিন্তু আপনার permission নেই” — তখন disabled + tooltip: “Contact admin for access”

-----
## <a name="error-ux"></a>**13. Error UX**
### <a name="error-types-ui"></a>**13.1 Error Types & UI**

|Error Type|UI|Example|
| :- | :- | :- |
|**Field validation**|Red border + inline message|“Email format invalid”|
|**API error (4xx)**|Error toast + field highlights|“Save failed: Name required”|
|**Server error (5xx)**|Error banner (top of page) + retry button|“Something went wrong. Try again.”|
|**Network error**|Error banner + retry|“Network error. Check connection.”|
|**Session expired**|Modal (non-dismissable)|“Session expired. Please login again.”|
### <a name="error-banner"></a>**13.2 Error Banner**
┌──────────────────────────────────────────────────────┐\
│ ⚠️  Something went wrong while loading leads.        │\
│     [Retry]  [Details]                      [✕ Close]│\
└──────────────────────────────────────────────────────┘

- Position: Top of content area (below breadcrumb)
- Background: --bd-danger-light
- Border-left: 4px solid --bd-danger
- Has retry button and close button
-----
## <a name="naming-convention"></a>**14. Naming Convention**
### <a name="css-classes"></a>**14.1 CSS Classes**
Prefix: bd-\
Format: bd-{component}-{modifier}\
\
Examples:\
`  `bd-btn-primary\
`  `bd-btn-secondary\
`  `bd-btn-ghost\
`  `bd-btn-danger\
`  `bd-card\
`  `bd-card-header\
`  `bd-input\
`  `bd-input-error\
`  `bd-grid\
`  `bd-grid-toolbar\
`  `bd-modal\
`  `bd-modal-footer\
`  `bd-badge\
`  `bd-badge-success\
`  `bd-empty-state\
`  `bd-skeleton\
`  `bd-skeleton-row\
`  `bd-toast\
`  `bd-toast-success\
`  `bd-alert\
`  `bd-alert-danger
### <a name="javascripttypescript-window-globals"></a>**14.2 JavaScript/TypeScript Window Globals**
Prefix: bd\
Format: bd{Service}\
\
Examples:\
`  `window.bdApi        → API service\
`  `window.bdToast      → Toast service\
`  `window.bdLoading    → Loading service\
`  `window.bdNav        → Navigation service\
`  `window.bdTheme      → Theme service\
`  `window.bdModal      → Modal service\
`  `window.bdGrid       → Grid service\
`  `window.bdAuth       → Auth service\
`  `window.bdFormGuard  → Form guard
### <a name="css-variable-naming"></a>**14.3 CSS Variable Naming**
Prefix: --bd-\
Format: --bd-{category}-{property}\
\
Examples:\
`  `--bd-space-4\
`  `--bd-text-base\
`  `--bd-fw-medium\
`  `--bd-primary\
`  `--bd-shadow-md\
`  `--bd-radius-lg\
`  `--bd-transition-base
### <a name="file-naming"></a>**14.4 File Naming**
TypeScript:  kebab-case.ts      → api-service.ts, theme-picker.ts\
CSS:         kebab-case.css     → design-tokens.css, components.css\
Razor:       \_PascalCase.cshtml → \_GridPageShell.cshtml, \_EmptyState.cshtml\
C# classes:  PascalCase.cs      → ThemeService.cs, LeadController.cs

-----
## <a name="implementation-status-gap-analysis"></a>**15. Implementation Status & Gap Analysis**
### <a name="current-status-as-of-2026-03-28"></a>**Current Status (as of 2026-03-28)**

|Design System Section|Implementation|Score|Notes|
| :- | :- | :- | :- |
|Design Tokens (spacing)|❌ Not done|0%|--bd-space-\* variables নেই|
|Design Tokens (typography)|❌ Not done|0%|--bd-text-\* variables নেই|
|Design Tokens (colors)|⚠️ Partial|20%|themes.css-এ Kendo theme colors, কিন্তু --bd-\* naming নেই|
|Design Tokens (shadows)|❌ Not done|0%|--bd-shadow-\* নেই|
|Design Tokens (radius)|❌ Not done|0%||
|Button Standard|⚠️ Partial|25%|কিছু style components.css-এ, কিন্তু bd-btn-\* নেই|
|Input Standard|⚠️ Kendo default|15%|Custom bd-input standard নেই|
|Cards|❌ Not done|0%||
|Modal (bd-modal)|✅ JS done|50%|bd-modal.js (11KB), TS empty|
|Grid UX|⚠️ JS partial|30%|grid-base.js (18.7KB), TS empty|
|Grid Context Menu|❌ Not done|0%||
|Grid Checkbox Selection|❌ Not done|0%||
|Empty State|❌ Not done|0%||
|Toast|✅ TS done|80%|toast.ts working|
|Loading (3-level)|✅ TS done|70%|loading.ts working, skeleton missing|
|Form Layout (2-col)|⚠️ Partial|35%|\_GridPageShell.cshtml has structure|
|Form Validation Visual|❌ Not done|0%|No standard validation CSS|
|Form Guard|✅ JS done|50%|form-guard.js (10.6KB), TS empty|
|Sticky Save Bar|✅ Done|80%|In \_GridPageShell.cshtml|
|Navigation (sidebar)|✅ Done|85%|sidebar.js + navigation-service.ts|
|Breadcrumb|✅ Done|80%|\_Breadcrumb.cshtml + navigation-service.ts|
|Theme System|✅ Done|85%|theme-service.ts + theme-picker.ts + themes.css|
|Command Palette|✅ JS done|50%|command-palette.js (14.5KB), TS empty|
|Notification Center|✅ JS done|50%|notification-center.js (13.5KB), TS empty|
|Skeleton Loading|⚠️ App-level only|20%|Grid/Form skeleton নেই|
|Responsive|⚠️ Partial|40%|Some media queries in layout.css|
|Permission UX|⚠️ Menu-level|40%|Menu filter done, button-level নেই|
|Error UX|⚠️ Toast only|30%|Banner/Retry নেই|
|**OVERALL**||**~28%**||
### <a name="key-gaps-highest-priority"></a>**Key Gaps (Highest Priority)**
1. **Design Tokens CSS file** — Foundation of everything, 0% done
1. **Empty TS files** — 5 components/services need JS→TS migration
1. **Grid Context Menu** — Enterprise must-have, 0% done
1. **Empty State** — Better UX, 0% done
1. **Form Validation Visual** — No standard, 0% done
-----
## <a name="implementation-roadmap"></a>**16. Implementation Roadmap**
### <a name="phase-1-foundation-do-first"></a>**Phase 1: Foundation (DO FIRST)**

|#|Task|Files|Priority|
| :- | :- | :- | :- |
|1\.1|Create design-tokens.css|wwwroot/css/design-tokens.css|🔴 Critical|
|1\.2|Apply tokens to existing CSS|Update layout.css, components.css, sidebar.css|🔴 Critical|
|1\.3|Create \_EmptyState.cshtml|Views/Shared/\_EmptyState.cshtml|🔴 Critical|
|1\.4|Create base component CSS|wwwroot/css/design-system.css — buttons, inputs, cards, badges|🔴 Critical|
### <a name="phase-2-ts-migration-core-components"></a>**Phase 2: TS Migration (Core Components)**

|#|Task|Source|Target|
| :- | :- | :- | :- |
|2\.1|Grid Service|grid-base.js (18.7KB)|ts-src/services/grid-service.ts|
|2\.2|Modal Service|bd-modal.js (11KB)|ts-src/components/bd-modal.ts|
|2\.3|Form Guard|form-guard.js (10.6KB)|ts-src/components/form-guard.ts|
|2\.4|Auth Service|session-guard.js + shell-init.js|ts-src/services/auth-service.ts|
|2\.5|Menu Service|sidebar.js (10.3KB)|ts-src/services/menu-service.ts|
### <a name="phase-3-advanced-components"></a>**Phase 3: Advanced Components**

|#|Task|Source|Target|
| :- | :- | :- | :- |
|3\.1|Command Palette|command-palette.js (14.5KB)|ts-src/components/command-palette.ts|
|3\.2|Notification Center|notification-center.js (13.5KB)|ts-src/components/notification-center.ts|
|3\.3|Grid Context Menu|New|ts-src/components/grid-context-menu.ts|
|3\.4|Skeleton Components|New|CSS + TS|
|3\.5|Error Banner|New|CSS + TS|
### <a name="phase-4-cleanup"></a>**Phase 4: Cleanup**

|#|Task|
| :- | :- |
|4\.1|Remove all wwwroot/js/\*.js plain files (replaced by bundle.js)|
|4\.2|Remove all \*\_2.\* duplicate files|
|4\.3|Update \_Layout.cshtml to load only bundle.js + design-tokens.css|
|4\.4|Update Living Doc status|

-----
## <a name="file-architecture-reference"></a>**17. File Architecture Reference**
### <a name="final-target-state-after-all-cleanup"></a>**Final Target State (after all cleanup)**
bdDevs.Web/\
├── package.json\
├── tsconfig.json\
├── build.js\
├── ts-src/\
│   ├── bundle.ts\
│   ├── types/\
│   │   ├── api.types.ts\
│   │   ├── grid.types.ts\
│   │   ├── theme.types.ts\
│   │   └── ui.types.ts\
│   ├── core/\
│   │   ├── api-service.ts\
│   │   ├── event-bus.ts\
│   │   ├── loading.ts\
│   │   └── toast.ts\
│   ├── services/\
│   │   ├── auth-service.ts\
│   │   ├── grid-service.ts\
│   │   ├── menu-service.ts\
│   │   ├── navigation-service.ts\
│   │   └── theme-service.ts\
│   └── components/\
│       ├── bd-modal.ts\
│       ├── command-palette.ts\
│       ├── form-guard.ts\
│       ├── grid-context-menu.ts    ← NEW\
│       ├── notification-center.ts\
│       └── theme-picker.ts\
├── Views/\
│   ├── Shared/\
│   │   ├── \_Layout.cshtml\
│   │   ├── \_Topbar.cshtml\
│   │   ├── \_Sidebar.cshtml\
│   │   ├── \_Footer.cshtml\
│   │   ├── \_Breadcrumb.cshtml\
│   │   ├── \_PageHeader.cshtml\
│   │   ├── \_NotificationPanel.cshtml\
│   │   ├── \_CommandPalette.cshtml\
│   │   ├── \_EmptyState.cshtml       ← NEW\
│   │   └── Error.cshtml\
│   ├── Templates/\
│   │   ├── \_GridPageShell.cshtml\
│   │   └── \_FormPageShell.cshtml     ← Planned\
│   ├── Home/\
│   └── Leads/\
├── wwwroot/\
│   ├── css/\
│   │   ├── design-tokens.css        ← NEW (spacing, typography, colors, shadows)\
│   │   ├── design-system.css        ← NEW (buttons, inputs, cards, badges)\
│   │   ├── layout.css\
│   │   ├── sidebar.css\
│   │   ├── components.css\
│   │   └── themes.css\
│   ├── js/\
│   │   ├── dist/\
│   │   │   └── bundle.js            ← esbuild output (ONLY JS file loaded)\
│   │   └── shell-init.js            ← Plain JS boot (may merge into bundle)\
│   └── favicon.ico\
├── Controllers/\
├── Services/\
├── Models/\
└── Program.cs

-----
## <a name="decision-log"></a>**18. Decision Log**

|#|Decision|Why|Date|
| :- | :- | :- | :- |
|1|TypeScript + esbuild (not webpack)|100x faster, zero config|Phase 1A|
|2|IIFE bundle format|Browser globals needed for Razor + Kendo jQuery|Phase 1A|
|3|bdApi.grid() — no Kendo DataSource transport|Full control, typed, debuggable|Phase 1A|
|4|Kendo Default theme family (primary)|Clean, professional, least opinionated|Phase 1A|
|5|Checkbox row selection (not row click select)|Enterprise standard, bulk action support|v2.0|
|6|Hidden > Disabled for permission UX|Less user confusion|v2.0|
|7|2-column form layout (desktop)|Enterprise standard, efficient space use|v2.0|
|8|Design tokens in separate CSS file|Foundation layer, must load first|v2.0|
|9|bd- prefix for all custom CSS classes|Avoid collision with Kendo k- classes|v2.0|
|10|Delete always last in context menu + red + confirm|Safety, enterprise convention|v2.0|
|11|300ms debounce on grid search|Balance between speed and API load|v2.0|
|12|Toast top-right, max 3 stacked|Non-intrusive, standard position|v2.0|
|13|Sticky save bar (not floating button)|Clear CTA, enterprise pattern|Phase 1A|
|14|\_2 suffix files = skip/ignore|Alternative iterations, will be cleaned up|v2.0|

-----
**📌 এই document আপডেট করবেন যখনই:** - নতুন design decision নেবেন - Implementation status পরিবর্তন হবে - নতুন component pattern add হবে - Phase transition হবে

**Format:** .md ফাইল হিসেবে repo-তে রাখুন — GitHub-এ সরাসরি পড়া যাবে।
