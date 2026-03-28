/**
 * app.js — bdDevs Core Application
 * Step 7.1 — App Shell Foundation
 *
 * Responsibilities:
 *   • Boot sequence (skeleton → shell)
 *   • Global apiService (fetch wrapper)
 *   • Ajax begin/end hooks (NProgress)
 *   • Global event bus
 *   • User context hydration
 */

'use strict';

window.bdApp = (function () {

    // ─────────────────────────────────────────────────────────
    //  STATE
    // ─────────────────────────────────────────────────────────
    let _booted = false;
    let _userContext = null;

    // ─────────────────────────────────────────────────────────
    //  EVENT BUS  (tiny pub/sub)
    // ─────────────────────────────────────────────────────────
    const _listeners = {};

    const events = {
        on(event, fn)  { (_listeners[event] || (_listeners[event] = [])).push(fn); },
        off(event, fn) { _listeners[event] = (_listeners[event] || []).filter(f => f !== fn); },
        emit(event, data) { (_listeners[event] || []).forEach(fn => { try { fn(data); } catch(e){} }); }
    };

    // ─────────────────────────────────────────────────────────
    //  API SERVICE
    // ─────────────────────────────────────────────────────────
    const apiService = {
        /**
         * Core fetch wrapper.
         * Handles: loading bar, auth headers, JSON parsing, error extraction.
         */
        async request(url, options = {}) {
            bdLoading.page.start();

            const config = window.bdConfig || {};
            const baseUrl = config.apiBase || '';

            // Build full URL if relative path given
            const fullUrl = url.startsWith('http') ? url : (baseUrl + url);

            // Default headers
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            // JWT from cookie (HttpOnly) is sent automatically.
            // If you store access token in memory, attach here:
            // headers['Authorization'] = 'Bearer ' + accessToken;

            try {
                const response = await fetch(fullUrl, {
                    credentials: 'include', // send HttpOnly cookies
                    ...options,
                    headers
                });

                // Handle 401 → session expired
                if (response.status === 401) {
                    events.emit('auth:unauthorized');
                    throw new Error('Unauthorized');
                }

                // Handle 403 → forbidden
                if (response.status === 403) {
                    bdToast.error('You do not have permission to perform this action.');
                    throw new Error('Forbidden');
                }

                const data = await response.json();

                if (!response.ok) {
                    const msg = data?.message || data?.errors?.[0]?.message || 'An error occurred.';
                    throw { response, data, message: msg };
                }

                return data;

            } catch (err) {
                if (err.message !== 'Unauthorized' && err.message !== 'Forbidden') {
                    console.error('[bdApp.apiService]', err);
                }
                throw err;
            } finally {
                bdLoading.page.done();
            }
        },

        get(url, params) {
            let finalUrl = url;
            if (params) {
                const qs = new URLSearchParams(params).toString();
                finalUrl = url + (url.includes('?') ? '&' : '?') + qs;
            }
            return this.request(finalUrl, { method: 'GET' });
        },

        post(url, body) {
            return this.request(url, { method: 'POST', body: JSON.stringify(body) });
        },

        put(url, body) {
            return this.request(url, { method: 'PUT', body: JSON.stringify(body) });
        },

        delete(url) {
            return this.request(url, { method: 'DELETE' });
        }
    };

    // ─────────────────────────────────────────────────────────
    //  JQUERY AJAX HOOKS (for Kendo datasource AJAX)
    // ─────────────────────────────────────────────────────────
    function _initAjaxHooks() {
        if (typeof $ === 'undefined') return;

        $(document).ajaxStart(function () {
            bdLoading.component.show('bdPageContent');
        });

        $(document).ajaxStop(function () {
            bdLoading.component.hide('bdPageContent');
            bdLoading.page.done();
        });

        $(document).ajaxError(function (event, jqXHR) {
            if (jqXHR.status === 401) {
                events.emit('auth:unauthorized');
            }
        });
    }

    // ─────────────────────────────────────────────────────────
    //  USER CONTEXT  (hydrate topbar from JWT claims)
    // ─────────────────────────────────────────────────────────
    function _hydrateUserContext() {
        const cfg = window.bdConfig || {};

        _userContext = {
            userId:       cfg.userId,
            displayName:  cfg.userDisplayName || 'User',
            avatar:       cfg.userAvatar,
        };

        // Set initials + name in topbar
        const name = _userContext.displayName;
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        const $initials     = document.getElementById('bdUserInitials');
        const $initialsMenu = document.getElementById('bdUserInitialsMenu');
        const $nameEl       = document.getElementById('bdUserName');
        const $nameMenuEl   = document.getElementById('bdUserNameMenu');

        if ($initials)     $initials.textContent     = initials;
        if ($initialsMenu) $initialsMenu.textContent  = initials;
        if ($nameEl)       $nameEl.textContent        = name.split(' ')[0]; // short name
        if ($nameMenuEl)   $nameMenuEl.textContent    = name;

        if (_userContext.avatar) {
            const avatarEl = document.getElementById('bdUserAvatar');
            if (avatarEl) {
                avatarEl.innerHTML = `<img src="${_userContext.avatar}" alt="${name}" />`;
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    //  OUTSIDE CLICK HANDLER (close dropdowns etc.)
    // ─────────────────────────────────────────────────────────
    function _initOutsideClicks() {
        document.addEventListener('click', function (e) {
            // Close all dropdown menus if click is outside
            const dropdowns = document.querySelectorAll('.bd-dropdown-menu, .bd-theme-panel');
            dropdowns.forEach(d => {
                if (!d.closest('[id]')?.contains(e.target)) {
                    // Handled individually by each module
                }
            });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  TOPBAR DROPDOWN TOGGLES
    // ─────────────────────────────────────────────────────────
    function _initTopbarToggles() {
        // Settings dropdown
        _bindToggle('bdSettingsBtn', 'bdSettingsMenu');

        // User menu dropdown
        _bindToggle('bdAvatarBtn', 'bdUserMenu');

        // Theme panel
        _bindToggle('bdThemeBtn', 'bdThemePanel');

        // Logout buttons
        ['bdLogoutBtn', 'bdLogoutBtn2'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', _handleLogout);
        });

        // Notification bell
        const bellBtn = document.getElementById('bdNotificationBtn');
        if (bellBtn) bellBtn.addEventListener('click', function () {
            events.emit('notification:toggle');
        });

        // Search trigger → command palette
        const searchBtn = document.getElementById('bdSearchTrigger');
        if (searchBtn) searchBtn.addEventListener('click', function () {
            events.emit('commandpalette:open');
        });

        // Theme panel close button
        const themeClose = document.getElementById('bdThemePanelClose');
        if (themeClose) themeClose.addEventListener('click', function () {
            const panel = document.getElementById('bdThemePanel');
            if (panel) panel.style.display = 'none';
        });
    }

    function _bindToggle(btnId, menuId) {
        const btn  = document.getElementById(btnId);
        const menu = document.getElementById(menuId);
        if (!btn || !menu) return;

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = menu.style.display !== 'none';
            // Close all others
            document.querySelectorAll('.bd-dropdown-menu, .bd-theme-panel').forEach(m => {
                m.style.display = 'none';
            });
            if (!isOpen) menu.style.display = 'block';
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        });
    }

    async function _handleLogout() {
        try {
            await apiService.post('/auth/logout', {});
        } catch (_) {}
        window.location.href = '/account/login';
    }

    // ─────────────────────────────────────────────────────────
    //  MOBILE SIDEBAR BACKDROP
    // ─────────────────────────────────────────────────────────
    function _initMobileBackdrop() {
        const backdrop = document.getElementById('bdSidebarBackdrop');
        if (backdrop) {
            backdrop.addEventListener('click', function () {
                events.emit('sidebar:close');
            });
        }
    }

    // ─────────────────────────────────────────────────────────
    //  BOOT SEQUENCE
    // ─────────────────────────────────────────────────────────
    async function boot() {
        if (_booted) return;

        try {
            // 1. Apply theme immediately (before anything flickers)
            //    theme-switcher.js handles this on its own DOMContentLoaded
            //    but we ensure the html attributes are set here too
            const cfg = window.bdConfig || {};
            if (cfg.themeFamily) document.documentElement.setAttribute('data-theme-family', cfg.themeFamily);
            if (cfg.themeMode)   document.documentElement.setAttribute('data-theme-mode',   cfg.themeMode);
            if (cfg.density)     document.documentElement.setAttribute('data-density',       cfg.density);

            // 2. Hydrate user context into topbar
            _hydrateUserContext();

            // 3. Init UI wiring
            _initTopbarToggles();
            _initMobileBackdrop();
            _initOutsideClicks();
            _initAjaxHooks();

            // 4. Show app shell, hide skeleton
            const skeleton = document.getElementById('bdAppSkeleton');
            const shell    = document.getElementById('bdAppShell');

            if (shell)    { shell.style.display = 'flex'; }
            if (skeleton) {
                skeleton.style.transition = 'opacity 0.25s ease';
                skeleton.style.opacity = '0';
                setTimeout(() => skeleton.style.display = 'none', 280);
            }

            _booted = true;
            events.emit('app:ready');

        } catch (err) {
            console.error('[bdApp.boot] Failed:', err);
            // Still show the shell on error — don't block the user
            const skeleton = document.getElementById('bdAppSkeleton');
            const shell    = document.getElementById('bdAppShell');
            if (skeleton) skeleton.style.display = 'none';
            if (shell)    shell.style.display = 'flex';
        }
    }

    // ─────────────────────────────────────────────────────────
    //  PUBLIC API
    // ─────────────────────────────────────────────────────────
    return {
        boot,
        apiService,
        events,
        getUser: () => _userContext,
    };

})();

// Aliases for convenience
window.bdApi    = window.bdApp.apiService;
window.bdEvents = window.bdApp.events;
