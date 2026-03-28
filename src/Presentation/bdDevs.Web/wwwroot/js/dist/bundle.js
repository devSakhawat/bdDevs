"use strict";
(() => {
  // ts-src/core/event-bus.ts
  var EventBus = class {
    constructor() {
      this.handlers = /* @__PURE__ */ new Map();
    }
    on(event, handler) {
      if (!this.handlers.has(event))
        this.handlers.set(event, []);
      this.handlers.get(event).push(handler);
    }
    off(event, handler) {
      const list = this.handlers.get(event) ?? [];
      this.handlers.set(event, list.filter((h) => h !== handler));
    }
    emit(event, data) {
      this.handlers.get(event)?.forEach((h) => h(data));
    }
    // One-time listener
    once(event, handler) {
      const wrapper = (data) => {
        handler(data);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    }
  };
  var eventBus = new EventBus();
  var Events = {
    // Auth
    TOKEN_REFRESHED: "auth:tokenRefreshed",
    SESSION_EXPIRING: "auth:sessionExpiring",
    LOGOUT: "auth:logout",
    // Theme
    THEME_CHANGED: "theme:changed",
    // Loading
    PAGE_LOAD_START: "loading:pageStart",
    PAGE_LOAD_END: "loading:pageEnd",
    // Notifications
    NOTIFICATION_PUSH: "notification:push",
    NOTIFICATION_READ: "notification:read",
    // Grid
    GRID_REFRESH: "grid:refresh"
  };

  // ts-src/core/api-service.ts
  var TOKEN_KEY = "bd_access_token";
  var EXPIRY_KEY = "bd_token_expiry";
  var BdApiService = class {
    constructor() {
      this.baseUrl = "/api";
    }
    // ── Token Management ───────────────────────────────────────────
    setToken(token, expiresAt) {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(EXPIRY_KEY, expiresAt);
    }
    clearToken() {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(EXPIRY_KEY);
    }
    getToken() {
      return sessionStorage.getItem(TOKEN_KEY);
    }
    getTokenExpiry() {
      const v = sessionStorage.getItem(EXPIRY_KEY);
      return v ? new Date(v) : null;
    }
    isTokenExpired() {
      const expiry = this.getTokenExpiry();
      if (!expiry)
        return true;
      return /* @__PURE__ */ new Date() >= expiry;
    }
    isTokenExpiringSoon(thresholdMinutes = 3) {
      const expiry = this.getTokenExpiry();
      if (!expiry)
        return true;
      const threshold = /* @__PURE__ */ new Date();
      threshold.setMinutes(threshold.getMinutes() + thresholdMinutes);
      return threshold >= expiry;
    }
    // ── HTTP Methods ───────────────────────────────────────────────
    async get(url, params) {
      const qs = params ? "?" + new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString() : "";
      return this._fetch(`${url}${qs}`, "GET");
    }
    async post(url, body) {
      return this._fetch(url, "POST", body);
    }
    async put(url, body) {
      return this._fetch(url, "PUT", body);
    }
    async delete(url) {
      return this._fetch(url, "DELETE");
    }
    // ── Grid Fetch — replaces Kendo DataSource transport ──────────
    async grid(endpoint, options) {
      const response = await this.post(endpoint, options);
      if (!response.success || !response.data) {
        throw new Error(
          response.errors?.[0]?.message ?? "Grid fetch failed"
        );
      }
      return response.data;
    }
    // ── Silent Token Refresh ───────────────────────────────────────
    async refreshToken() {
      try {
        const res = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include"
          // HttpOnly cookie auto-sent
        });
        if (!res.ok)
          return false;
        const data = await res.json();
        if (data.success && data.data) {
          this.setToken(data.data.accessToken, data.data.expiresAt);
          eventBus.emit(Events.TOKEN_REFRESHED);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }
    // ── Core Fetch ─────────────────────────────────────────────────
    async _fetch(url, method, body) {
      const correlationId = crypto.randomUUID();
      const headers = {
        "Content-Type": "application/json",
        "X-Correlation-Id": correlationId
      };
      const token = this.getToken();
      if (token)
        headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers,
        credentials: "include",
        body: body !== void 0 ? JSON.stringify(body) : void 0
      });
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          headers["Authorization"] = `Bearer ${this.getToken()}`;
          const retry = await fetch(`${this.baseUrl}${url}`, {
            method,
            headers,
            credentials: "include",
            body: body !== void 0 ? JSON.stringify(body) : void 0
          });
          if (retry.ok)
            return retry.json();
        }
        eventBus.emit(Events.LOGOUT);
        window.location.href = "/auth/login";
        return Promise.reject(new Error("Session expired"));
      }
      return response.json();
    }
  };
  var bdApi = new BdApiService();

  // ts-src/core/loading.ts
  var LoadingService = class {
    constructor() {
      this.pageLoadCount = 0;
      this.progressBar = null;
      this.progressTimer = null;
    }
    init() {
      this.progressBar = document.getElementById("bd-progress-bar");
      eventBus.on(Events.PAGE_LOAD_START, () => this.startPage());
      eventBus.on(Events.PAGE_LOAD_END, () => this.endPage());
    }
    // ── App Shell Loading ─────────────────────────────────────────
    showAppSkeleton() {
      document.getElementById("bd-app-skeleton")?.classList.remove("d-none");
      document.getElementById("bd-main-content")?.classList.add("d-none");
    }
    hideAppSkeleton() {
      const skeleton = document.getElementById("bd-app-skeleton");
      const content = document.getElementById("bd-main-content");
      skeleton?.classList.add("fade-out");
      setTimeout(() => {
        skeleton?.classList.add("d-none");
        skeleton?.classList.remove("fade-out");
        content?.classList.remove("d-none");
      }, 300);
    }
    // ── Page Loading (NProgress style) ───────────────────────────
    startPage() {
      this.pageLoadCount++;
      if (!this.progressBar)
        return;
      this.progressBar.style.width = "0%";
      this.progressBar.style.opacity = "1";
      this._animateTo(70);
    }
    endPage() {
      this.pageLoadCount = Math.max(0, this.pageLoadCount - 1);
      if (this.pageLoadCount > 0)
        return;
      if (!this.progressBar)
        return;
      this._animateTo(100);
      setTimeout(() => {
        if (this.progressBar)
          this.progressBar.style.opacity = "0";
      }, 300);
    }
    // ── Component Loading ─────────────────────────────────────────
    showComponentSpinner(container) {
      const el = typeof container === "string" ? document.getElementById(container) : container;
      if (!el)
        return;
      const spinner = document.createElement("div");
      spinner.className = "bd-component-spinner";
      spinner.innerHTML = '<span class="bd-spinner"></span>';
      el.appendChild(spinner);
    }
    hideComponentSpinner(container) {
      const el = typeof container === "string" ? document.getElementById(container) : container;
      el?.querySelector(".bd-component-spinner")?.remove();
    }
    _animateTo(target) {
      if (!this.progressBar)
        return;
      if (this.progressTimer)
        clearTimeout(this.progressTimer);
      const current = parseFloat(this.progressBar.style.width || "0");
      const step = (target - current) / 10;
      let curr = current;
      const tick = () => {
        curr += step;
        if (this.progressBar)
          this.progressBar.style.width = `${Math.min(curr, target)}%`;
        if (curr < target)
          this.progressTimer = setTimeout(tick, 30);
      };
      tick();
    }
  };
  var loadingService = new LoadingService();

  // ts-src/core/toast.ts
  var DURATIONS = {
    success: 3e3,
    info: 4e3,
    warning: 5e3,
    error: 7e3
  };
  var ICONS = {
    success: "fa-circle-check",
    info: "fa-circle-info",
    warning: "fa-triangle-exclamation",
    error: "fa-circle-xmark"
  };
  var ToastService = class {
    constructor() {
      this.container = null;
    }
    init() {
      this.container = document.getElementById("bd-toast-host");
    }
    show(options) {
      if (!this.container)
        return;
      const duration = options.duration ?? DURATIONS[options.type];
      const id = `toast-${Date.now()}`;
      const el = document.createElement("div");
      el.id = id;
      el.className = `bd-toast bd-toast--${options.type} slide-in`;
      el.innerHTML = `
      <div class="bd-toast__icon">
        <i class="fa-solid ${ICONS[options.type]}"></i>
      </div>
      <div class="bd-toast__body">
        ${options.title ? `<div class="bd-toast__title">${options.title}</div>` : ""}
        <div class="bd-toast__message">${options.message}</div>
        ${options.actionLabel ? `<a class="bd-toast__action"
               href="${options.actionUrl ?? "#"}">
               ${options.actionLabel} \u2192
             </a>` : ""}
      </div>
      <button class="bd-toast__close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="bd-toast__progress">
        <div class="bd-toast__progress-bar"
             style="animation-duration: ${duration}ms"></div>
      </div>`;
      el.querySelector(".bd-toast__close")?.addEventListener("click", () => this._dismiss(el));
      if (options.onAction) {
        el.querySelector(".bd-toast__action")?.addEventListener("click", (e) => {
          e.preventDefault();
          options.onAction();
          this._dismiss(el);
        });
      }
      this.container.appendChild(el);
      setTimeout(() => this._dismiss(el), duration);
    }
    // Shortcuts
    success(message, title, actionLabel, actionUrl) {
      this.show({ type: "success", message, title, actionLabel, actionUrl });
    }
    error(message, title = "Error") {
      this.show({ type: "error", message, title });
    }
    warning(message, title) {
      this.show({ type: "warning", message, title });
    }
    info(message, title) {
      this.show({ type: "info", message, title });
    }
    _dismiss(el) {
      el.classList.add("slide-out");
      setTimeout(() => el.remove(), 300);
    }
  };
  var toastService = new ToastService();

  // ts-src/services/navigation-service.ts
  var ROUTE_MAP = {
    "/dashboard": {
      title: "Dashboard",
      icon: "fa-gauge",
      module: "Dashboard",
      breadcrumbs: [{ label: "Dashboard" }]
    },
    // CRM
    "/crm/leads": {
      title: "Leads",
      icon: "fa-funnel",
      module: "CRM",
      breadcrumbs: [
        { label: "CRM", url: "#" },
        { label: "Leads" }
      ]
    },
    "/crm/leads/create": {
      title: "New Lead",
      icon: "fa-plus",
      module: "CRM",
      breadcrumbs: [
        { label: "CRM", url: "#" },
        { label: "Leads", url: "/crm/leads" },
        { label: "New Lead" }
      ]
    },
    "/crm/students": {
      title: "Students",
      icon: "fa-graduation-cap",
      module: "CRM",
      breadcrumbs: [
        { label: "CRM", url: "#" },
        { label: "Students" }
      ]
    },
    "/crm/applications": {
      title: "Applications",
      icon: "fa-file-lines",
      module: "CRM",
      breadcrumbs: [
        { label: "CRM", url: "#" },
        { label: "Applications" }
      ]
    },
    // Admin
    "/admin/users": {
      title: "User Management",
      icon: "fa-user-shield",
      module: "Admin",
      breadcrumbs: [
        { label: "Administration", url: "#" },
        { label: "Users" }
      ]
    },
    "/admin/roles": {
      title: "Role Management",
      icon: "fa-lock",
      module: "Admin",
      breadcrumbs: [
        { label: "Administration", url: "#" },
        { label: "Roles" }
      ]
    },
    "/admin/audit-logs": {
      title: "Audit Logs",
      icon: "fa-list-check",
      module: "Admin",
      breadcrumbs: [
        { label: "Administration", url: "#" },
        { label: "Audit Logs" }
      ]
    }
  };
  var NavigationService = class {
    constructor() {
      this.currentPath = "";
      this.currentMeta = null;
    }
    // ── Resolve current page meta ─────────────────────────────
    resolve(path) {
      const url = path ?? window.location.pathname;
      this.currentPath = url;
      if (ROUTE_MAP[url]) {
        this.currentMeta = ROUTE_MAP[url];
        return this.currentMeta;
      }
      const dynamicMeta = this._resolveDynamic(url);
      this.currentMeta = dynamicMeta;
      return dynamicMeta;
    }
    // ── Apply to DOM ──────────────────────────────────────────
    apply(path) {
      const meta = this.resolve(path);
      document.title = `${meta.title} \u2014 bdDevCRM`;
      this._renderBreadcrumb(meta.breadcrumbs);
      this._syncActiveMenu(this.currentPath);
      this._updatePageHeader(meta);
      eventBus.emit("navigation:changed", meta);
    }
    getCurrentMeta() {
      return this.currentMeta;
    }
    // ── Register dynamic route (called from pages) ────────────
    register(path, meta) {
      ROUTE_MAP[path] = meta;
    }
    // ── Private ───────────────────────────────────────────────
    _resolveDynamic(url) {
      const leadDetail = url.match(/^\/crm\/leads\/(\d+)$/);
      if (leadDetail) {
        return {
          title: "Lead Detail",
          icon: "fa-funnel",
          module: "CRM",
          breadcrumbs: [
            { label: "CRM", url: "#" },
            { label: "Leads", url: "/crm/leads" },
            { label: `Lead #${leadDetail[1]}` }
          ]
        };
      }
      const studentDetail = url.match(/^\/crm\/students\/(\d+)$/);
      if (studentDetail) {
        return {
          title: "Student Profile",
          icon: "fa-graduation-cap",
          module: "CRM",
          breadcrumbs: [
            { label: "CRM", url: "#" },
            { label: "Students", url: "/crm/students" },
            { label: `Student #${studentDetail[1]}` }
          ]
        };
      }
      return this._buildFromUrl(url);
    }
    _buildFromUrl(url) {
      const parts = url.split("/").filter(Boolean);
      const crumbs = [];
      let built = "";
      parts.forEach((part, i) => {
        built += `/${part}`;
        const label = this._humanize(part);
        const isLast = i === parts.length - 1;
        crumbs.push({ label, url: isLast ? void 0 : built });
      });
      return {
        title: crumbs[crumbs.length - 1]?.label ?? "Page",
        icon: "fa-circle",
        module: this._humanize(parts[0] ?? ""),
        breadcrumbs: crumbs
      };
    }
    _humanize(slug) {
      return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    _renderBreadcrumb(items) {
      const bc = document.getElementById("bd-breadcrumb-container");
      if (!bc)
        return;
      bc.innerHTML = items.map((item, i) => {
        const isLast = i === items.length - 1;
        if (isLast) {
          return `<span class="bd-breadcrumb__item bd-breadcrumb__item--active">
                  ${item.icon ? `<i class="fa-solid ${item.icon} me-1"></i>` : ""}
                  ${item.label}
                </span>`;
        }
        return `
        <span class="bd-breadcrumb__item">
          ${item.url ? `<a href="${item.url}" data-partial="true">${item.label}</a>` : `<span>${item.label}</span>`}
        </span>
        <span class="bd-breadcrumb__separator">
          <i class="fa-solid fa-chevron-right"></i>
        </span>`;
      }).join("");
    }
    _syncActiveMenu(url) {
      document.querySelectorAll(".nav-link.active, .nav-group-toggle.active").forEach((el) => el.classList.remove("active"));
      const link = document.querySelector(
        `.nav-link[href="${url}"]`
      );
      if (!link)
        return;
      link.classList.add("active");
      const group = link.closest(".nav-group-items");
      if (group) {
        group.classList.add("show");
        const toggle = group.previousElementSibling;
        toggle?.classList.add("active");
      }
      link.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    _updatePageHeader(meta) {
      const titleEl = document.getElementById("bd-page-title");
      const iconEl = document.getElementById("bd-page-icon");
      if (titleEl)
        titleEl.textContent = meta.title;
      if (iconEl)
        iconEl.className = `fa-solid ${meta.icon}`;
    }
  };
  var navigationService = new NavigationService();

  // ts-src/bundle.ts
  window.bdNav = navigationService;
  window.bdApi = bdApi;
  window.bdToast = toastService;
  window.eventBus = eventBus;
  window.bdEvents = Events;
  window.bdLoading = loadingService;
  document.addEventListener("DOMContentLoaded", () => {
    loadingService.init();
    toastService.init();
    console.debug("[bdDevs] App shell initialized");
    navigationService.apply();
  });
})();
//# sourceMappingURL=bundle.js.map
