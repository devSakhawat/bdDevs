import { eventBus, Events } from '../core/event-bus';

export interface BreadcrumbItem {
    label: string;
    url?: string;
    icon?: string;
}

export interface PageMeta {
    title: string;
    icon: string;
    breadcrumbs: BreadcrumbItem[];
    module: string;
}

// ── Route → Page Meta Map ─────────────────────────────────────
//  when new page come then entry add here - rest will be auto.
const ROUTE_MAP: Record<string, PageMeta> = {
    '/dashboard': {
        title: 'Dashboard', icon: 'fa-gauge', module: 'Dashboard',
        breadcrumbs: [{ label: 'Dashboard' }]
    },
    // CRM
    '/crm/leads': {
        title: 'Leads', icon: 'fa-funnel', module: 'CRM',
        breadcrumbs: [
            { label: 'CRM', url: '#' },
            { label: 'Leads' }
        ]
    },
    '/crm/leads/create': {
        title: 'New Lead', icon: 'fa-plus', module: 'CRM',
        breadcrumbs: [
            { label: 'CRM', url: '#' },
            { label: 'Leads', url: '/crm/leads' },
            { label: 'New Lead' }
        ]
    },
    '/crm/students': {
        title: 'Students', icon: 'fa-graduation-cap', module: 'CRM',
        breadcrumbs: [
            { label: 'CRM', url: '#' },
            { label: 'Students' }
        ]
    },
    '/crm/applications': {
        title: 'Applications', icon: 'fa-file-lines', module: 'CRM',
        breadcrumbs: [
            { label: 'CRM', url: '#' },
            { label: 'Applications' }
        ]
    },
    // Admin
    '/admin/users': {
        title: 'User Management', icon: 'fa-user-shield', module: 'Admin',
        breadcrumbs: [
            { label: 'Administration', url: '#' },
            { label: 'Users' }
        ]
    },
    '/admin/roles': {
        title: 'Role Management', icon: 'fa-lock', module: 'Admin',
        breadcrumbs: [
            { label: 'Administration', url: '#' },
            { label: 'Roles' }
        ]
    },
    '/admin/audit-logs': {
        title: 'Audit Logs', icon: 'fa-list-check', module: 'Admin',
        breadcrumbs: [
            { label: 'Administration', url: '#' },
            { label: 'Audit Logs' }
        ]
    },
};

class NavigationService {
    private currentPath = '';
    private currentMeta: PageMeta | null = null;

    // ── Resolve current page meta ─────────────────────────────
    resolve(path?: string): PageMeta {
        const url = path ?? window.location.pathname;
        this.currentPath = url;

        // Exact match
        if (ROUTE_MAP[url]) {
            this.currentMeta = ROUTE_MAP[url];
            return this.currentMeta;
        }

        // Dynamic route match — e.g. /crm/leads/123
        const dynamicMeta = this._resolveDynamic(url);
        this.currentMeta = dynamicMeta;
        return dynamicMeta;
    }

    // ── Apply to DOM ──────────────────────────────────────────
    apply(path?: string): void {
        const meta = this.resolve(path);

        // 1. Page title
        document.title = `${meta.title} — bdDevCRM`;

        // 2. Breadcrumb
        this._renderBreadcrumb(meta.breadcrumbs);

        // 3. Active menu item
        this._syncActiveMenu(this.currentPath);

        // 4. Page header (if exists)
        this._updatePageHeader(meta);

        // Emit for other listeners
        eventBus.emit('navigation:changed', meta);
    }

    getCurrentMeta(): PageMeta | null {
        return this.currentMeta;
    }

    // ── Register dynamic route (called from pages) ────────────
    register(path: string, meta: PageMeta): void {
        ROUTE_MAP[path] = meta;
    }

    // ── Private ───────────────────────────────────────────────
    private _resolveDynamic(url: string): PageMeta {
        // /crm/leads/123 → detail page
        const leadDetail = url.match(/^\/crm\/leads\/(\d+)$/);
        if (leadDetail) {
            return {
                title: 'Lead Detail', icon: 'fa-funnel', module: 'CRM',
                breadcrumbs: [
                    { label: 'CRM', url: '#' },
                    { label: 'Leads', url: '/crm/leads' },
                    { label: `Lead #${leadDetail[1]}` }
                ]
            };
        }

        const studentDetail = url.match(/^\/crm\/students\/(\d+)$/);
        if (studentDetail) {
            return {
                title: 'Student Profile', icon: 'fa-graduation-cap', module: 'CRM',
                breadcrumbs: [
                    { label: 'CRM', url: '#' },
                    { label: 'Students', url: '/crm/students' },
                    { label: `Student #${studentDetail[1]}` }
                ]
            };
        }

        // Fallback — parse from URL segments
        return this._buildFromUrl(url);
    }

    private _buildFromUrl(url: string): PageMeta {
        const parts = url.split('/').filter(Boolean);
        const crumbs: BreadcrumbItem[] = [];
        let built = '';

        parts.forEach((part, i) => {
            built += `/${part}`;
            const label = this._humanize(part);
            const isLast = i === parts.length - 1;
            crumbs.push({ label, url: isLast ? undefined : built });
        });

        return {
            title: crumbs[crumbs.length - 1]?.label ?? 'Page',
            icon: 'fa-circle',
            module: this._humanize(parts[0] ?? ''),
            breadcrumbs: crumbs
        };
    }

    private _humanize(slug: string): string {
        return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    private _renderBreadcrumb(items: BreadcrumbItem[]): void {
        const bc = document.getElementById('bd-breadcrumb-container');
        if (!bc) return;

        bc.innerHTML = items.map((item, i) => {
            const isLast = i === items.length - 1;
            if (isLast) {
                return `<span class="bd-breadcrumb__item bd-breadcrumb__item--active">
                  ${item.icon
                        ? `<i class="fa-solid ${item.icon} me-1"></i>`
                        : ''}
                  ${item.label}
                </span>`;
            }
            return `
        <span class="bd-breadcrumb__item">
          ${item.url
                    ? `<a href="${item.url}" data-partial="true">${item.label}</a>`
                    : `<span>${item.label}</span>`}
        </span>
        <span class="bd-breadcrumb__separator">
          <i class="fa-solid fa-chevron-right"></i>
        </span>`;
        }).join('');
    }

    private _syncActiveMenu(url: string): void {
        // Remove all active
        document.querySelectorAll('.nav-link.active, .nav-group-toggle.active')
            .forEach(el => el.classList.remove('active'));

        // Find matching link
        const link = document.querySelector<HTMLAnchorElement>(
            `.nav-link[href="${url}"]`
        );
        if (!link) return;

        link.classList.add('active');

        // Expand parent group
        const group = link.closest('.nav-group-items');
        if (group) {
            group.classList.add('show');
            const toggle = group.previousElementSibling as HTMLElement;
            toggle?.classList.add('active');
        }

        // Scroll menu item into view
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    private _updatePageHeader(meta: PageMeta): void {
        // Page title in header (if _PageHeader partial exists)
        const titleEl = document.getElementById('bd-page-title');
        const iconEl = document.getElementById('bd-page-icon');

        if (titleEl) titleEl.textContent = meta.title;
        if (iconEl) iconEl.className = `fa-solid ${meta.icon}`;
    }
}

export const navigationService = new NavigationService();