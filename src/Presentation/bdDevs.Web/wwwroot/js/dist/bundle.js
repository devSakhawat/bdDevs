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

  // ts-src/types/theme.types.ts
  var DEFAULT_THEME = {
    themeFamily: "bootstrap",
    themeMode: "light",
    density: "comfortable",
    sidebarCollapsed: false,
    gridDefaults: { pageSize: 20 }
  };

  // ts-src/services/theme-service.ts
  var KENDO_BASE = "/lib/kendo/styles";
  var KENDO_THEME_FILES = {
    default: { light: "default-main.css", dark: "default-main-dark.css" },
    default_orange: { light: "default-orange.css", dark: "default-main-dark.css" },
    default_purple: { light: "default-purple.css", dark: "default-main-dark.css" },
    bootstrap: { light: "bootstrap-4.css", dark: "bootstrap-4-dark.css" },
    material: { light: "material-main", dark: "material-main-dark.css" },
    material_pacific: { light: "material-pacific.css", dark: "material-pacific-dark.css" },
    material_lime: { light: "material-lime.css", dark: "material-lime-dark.css" },
    material_smoke: { light: "material-smoke.css", dark: "material-main-dark.css" },
    fluent: { light: "fluent-main.css", dark: "fluent-main-dark.css" },
    classic_green: { light: "classic-green.css", dark: "classic-green-dark.css" },
    classic_lavender: { light: "classic-lavender.css", dark: "classic-lavender-dark.css" },
    classic_main: { light: "classic-main", dark: "classic-main-dark.css" },
    classic_metro: { light: "classic-metro.css", dark: "classic-metro-dark.css" },
    classic_opal: { light: "classic-opal.css", dark: "classic-opal-dark.css" },
    classic_silver: { light: "classic-silver", dark: "classic-silver-dark.css" }
  };
  var ThemeService = class {
    constructor() {
      this.current = { ...DEFAULT_THEME };
      this._saving = false;
    }
    // ── Init (called on app boot) ────────────────────────────
    init() {
      const fromCookie = this._loadFromCookie();
      if (fromCookie) {
        this.current = fromCookie;
      } else {
        const fromStorage = this._loadFromStorage();
        if (fromStorage) {
          this.current = fromStorage;
        } else {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          this.current.themeMode = prefersDark ? "dark" : "light";
        }
      }
      this._applyToDOM(this.current, false);
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        const hasManual = !!this._loadFromStorage();
        if (!hasManual) {
          this.setMode(e.matches ? "dark" : "light");
        }
      });
    }
    // ── Public API ───────────────────────────────────────────
    get() {
      return { ...this.current };
    }
    async setFamily(family) {
      this.current.themeFamily = family;
      await this._applyToDOM(this.current, true);
    }
    async setMode(mode) {
      this.current.themeMode = mode;
      await this._applyToDOM(this.current, true);
    }
    async setDensity(density) {
      this.current.density = density;
      await this._applyToDOM(this.current, true);
    }
    async setAll(pref) {
      this.current = { ...this.current, ...pref };
      await this._applyToDOM(this.current, true);
    }
    setSidebarState(collapsed) {
      this.current.sidebarCollapsed = collapsed;
      this._saveToStorage(this.current);
    }
    // ── Apply to DOM ─────────────────────────────────────────
    async _applyToDOM(pref, persist) {
      const { themeFamily, themeMode, density } = pref;
      const html = document.documentElement;
      html.setAttribute("data-theme-family", themeFamily);
      html.setAttribute("data-theme-mode", themeMode);
      html.setAttribute("data-density", density);
      this._swapKendoTheme(themeFamily, themeMode);
      eventBus.emit(Events.THEME_CHANGED, pref);
      if (persist) {
        this._saveToStorage(pref);
        this._saveToCookie(pref);
        await this._saveToDB(pref);
      }
    }
    _swapKendoTheme(family, mode) {
      const file = KENDO_THEME_FILES[family]?.[mode] ?? KENDO_THEME_FILES.bootstrap.light;
      const href = `${KENDO_BASE}/${file}`;
      let link = document.getElementById("kendo-theme");
      if (!link) {
        link = document.createElement("link");
        link.id = "kendo-theme";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      if (link.href !== href) {
        const preload = document.createElement("link");
        preload.rel = "preload";
        preload.as = "style";
        preload.href = href;
        document.head.appendChild(preload);
        requestAnimationFrame(() => {
          link.href = href;
          preload.remove();
        });
      }
    }
    // ── Storage ──────────────────────────────────────────────
    _saveToStorage(pref) {
      try {
        localStorage.setItem("bd_theme_pref", JSON.stringify(pref));
      } catch {
      }
    }
    _loadFromStorage() {
      try {
        const raw = localStorage.getItem("bd_theme_pref");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    _saveToCookie(pref) {
      const val = `${pref.themeFamily}|${pref.themeMode}|${pref.density}`;
      document.cookie = `bd_theme=${encodeURIComponent(val)};path=/;max-age=31536000;SameSite=Lax`;
    }
    _loadFromCookie() {
      try {
        const match = document.cookie.match(/bd_theme=([^;]+)/);
        if (!match)
          return null;
        const [family, mode, density] = decodeURIComponent(match[1]).split("|");
        if (!family || !mode || !density)
          return null;
        return {
          ...DEFAULT_THEME,
          themeFamily: family,
          themeMode: mode,
          density
        };
      } catch {
        return null;
      }
    }
    // ── DB Persist ───────────────────────────────────────────
    async _saveToDB(pref) {
      if (this._saving)
        return;
      this._saving = true;
      try {
        await bdApi.put("/user/preference/theme", {
          themeFamily: pref.themeFamily,
          themeMode: pref.themeMode,
          density: pref.density,
          sidebarCollapsed: pref.sidebarCollapsed,
          gridDefaults: pref.gridDefaults
        });
      } catch (err) {
        console.warn("[Theme] DB save failed (non-critical):", err);
      } finally {
        setTimeout(() => {
          this._saving = false;
        }, 1e3);
      }
    }
  };
  var themeService = new ThemeService();

  // ts-src/components/theme-picker.ts
  var FAMILIES = [
    { value: "default", label: "Default", swatch: "#1F3864" },
    { value: "bootstrap", label: "Bootstrap", swatch: "#0D6EFD" },
    { value: "material", label: "Material", swatch: "#6200EE" },
    { value: "fluent", label: "Fluent", swatch: "#0078D4" }
  ];
  var ThemePicker = class {
    constructor() {
      this.panel = null;
      this.isOpen = false;
    }
    init() {
      this._renderPanel();
      this._bindTrigger();
      this._syncUI();
    }
    // ── Render picker panel ──────────────────────────────────
    _renderPanel() {
      const existing = document.getElementById("bd-theme-picker");
      if (existing)
        existing.remove();
      const panel = document.createElement("div");
      panel.id = "bd-theme-picker";
      panel.className = "bd-theme-picker d-none";
      panel.innerHTML = `
      <div class="bd-theme-picker__header">
        <i class="fa-solid fa-palette"></i>
        Theme Settings
      </div>

      <!-- Family -->
      <div class="bd-theme-picker__section">
        <div class="bd-theme-picker__label">Theme Family</div>
        <div class="bd-theme-family-grid" id="bd-family-grid">
          ${FAMILIES.map((f) => `
            <button class="bd-theme-family-btn"
                    data-family="${f.value}"
                    title="${f.label}">
              <span class="swatch"
                    style="background:${f.swatch}"></span>
              ${f.label}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="bd-theme-picker__divider"></div>

      <!-- Mode -->
      <div class="bd-theme-picker__section">
        <div class="bd-theme-picker__label">Mode</div>
        <div class="bd-theme-mode-toggle">
          <button class="bd-theme-mode-btn" data-mode="light">
            <i class="fa-solid fa-sun"></i> Light
          </button>
          <button class="bd-theme-mode-btn" data-mode="dark">
            <i class="fa-solid fa-moon"></i> Dark
          </button>
        </div>
      </div>

      <div class="bd-theme-picker__divider"></div>

      <!-- Density -->
      <div class="bd-theme-picker__section">
        <div class="bd-theme-picker__label">Density</div>
        <div class="bd-density-toggle">
          <button class="bd-density-btn" data-density="comfortable">
            <i class="fa-solid fa-expand"></i><br>Comfortable
          </button>
          <button class="bd-density-btn" data-density="compact">
            <i class="fa-solid fa-compress"></i><br>Compact
          </button>
        </div>
      </div>

      <div class="bd-theme-picker__footer">
        Theme preference saved automatically
      </div>`;
      document.body.appendChild(panel);
      this.panel = panel;
      panel.querySelectorAll("[data-family]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const family = btn.dataset.family;
          themeService.setFamily(family);
          this._syncUI();
        });
      });
      panel.querySelectorAll("[data-mode]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const mode = btn.dataset.mode;
          themeService.setMode(mode);
          this._syncUI();
        });
      });
      panel.querySelectorAll("[data-density]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const density = btn.dataset.density;
          themeService.setDensity(density);
          this._syncUI();
        });
      });
      document.addEventListener("click", (e) => {
        const trigger = document.getElementById("bd-theme-btn");
        if (this.isOpen && !panel.contains(e.target) && !trigger?.contains(e.target)) {
          this.close();
        }
      });
    }
    _bindTrigger() {
      document.getElementById("bd-theme-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
    // ── Sync UI to current theme ─────────────────────────────
    _syncUI() {
      if (!this.panel)
        return;
      const pref = themeService.get();
      this.panel.querySelectorAll("[data-family]").forEach((btn) => {
        const el = btn;
        el.classList.toggle("active", el.dataset.family === pref.themeFamily);
      });
      this.panel.querySelectorAll("[data-mode]").forEach((btn) => {
        const el = btn;
        el.classList.toggle("active", el.dataset.mode === pref.themeMode);
      });
      this.panel.querySelectorAll("[data-density]").forEach((btn) => {
        const el = btn;
        el.classList.toggle("active", el.dataset.density === pref.density);
      });
      const icon = document.querySelector("#bd-theme-btn i");
      if (icon) {
        icon.className = pref.themeMode === "dark" ? "fa-solid fa-moon" : "fa-solid fa-palette";
      }
    }
    toggle() {
      this.isOpen ? this.close() : this.open();
    }
    open() {
      this.panel?.classList.remove("d-none");
      this.isOpen = true;
      this._syncUI();
    }
    close() {
      this.panel?.classList.add("d-none");
      this.isOpen = false;
    }
  };
  var themePicker = new ThemePicker();

  // ts-src/bundle.ts
  window.bdNav = navigationService;
  window.bdApi = bdApi;
  window.bdToast = toastService;
  window.eventBus = eventBus;
  window.bdEvents = Events;
  window.bdLoading = loadingService;
  window.bdTheme = themeService;
  document.addEventListener("DOMContentLoaded", () => {
    loadingService.init();
    toastService.init();
    navigationService.apply();
    themePicker.init();
    console.debug("[bdDevs] App shell initialized");
  });
})();
//# sourceMappingURL=bundle.js.map
