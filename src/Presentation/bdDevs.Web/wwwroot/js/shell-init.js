(function () {
    'use strict';

    // ── Boot Sequence ──────────────────────────────────────────
    // 1. Check token
    // 2. Load user context
    // 3. Show shell
    // 4. Enable content

    async function bootShell() {
        const token = sessionStorage.getItem('bd_access_token');

        // No token → redirect to login
        if (!token) {
            // Check if refresh cookie exists (silent refresh)
            const refreshed = await window.bdApi.refreshToken();
            if (!refreshed) {
                window.location.href = '/auth/login';
                return;
            }
        }

        // Apply navigation highlighting in bootShell() function
        // navigationService apply
        if (window.bdNav) {
            window.bdNav.apply(window.location.pathname);
        }

        try {
            // Load user context from JWT claims
            loadUserContext();
            // Sync theme from database after loading user context
            await syncThemeFromDB();

            // Show app shell
            document.getElementById('bd-app')
                ?.classList.remove('d-none');

            // Hide skeleton
            window.bdLoading.hideAppSkeleton();

            // Init sidebar toggle
            initSidebarToggle();

            // Init keyboard shortcuts
            initKeyboardShortcuts();

            // Init dropdowns
            initDropdowns();

            // Start session guard
            startSessionGuard();

        } catch (err) {
            console.error('[Shell] Boot failed:', err);
        }
    }

    /**
     * Sync theme preferences from database
     * Called at boot after token check to apply user's saved theme
     */
    async function syncThemeFromDB() {
        try {
            const result = await window.bdApi.get('/user/preference/theme');
            if (result.success && result.data) {
                await window.bdTheme.setAll(result.data);
            }
        } catch {
            // Non-critical — cookie/localStorage already applied
        }
    }

    // ── User Context from JWT ──────────────────────────────────
    function loadUserContext() {
        const token = sessionStorage.getItem('bd_access_token');
        if (!token) return;

        try {
            // JWT payload decode (no verify — already verified by server)
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Set username in topbar
            const nameEl = document.getElementById('bd-user-name');
            if (nameEl) nameEl.textContent = payload.fullName ?? payload.email ?? '';

            // Set avatar
            const avatarEl = document.getElementById('bd-user-avatar');
            if (avatarEl && payload.profileImageUrl)
                avatarEl.src = payload.profileImageUrl;

            // Last login
            const lastLoginEl = document.getElementById('bd-last-login');
            if (lastLoginEl && payload.lastLoginAt) {
                const d = new Date(payload.lastLoginAt);
                lastLoginEl.textContent =
                    `Last login: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
            }

        } catch { /* ignore decode errors */ }
    }

    // ── Sidebar Toggle ─────────────────────────────────────────
    function initSidebarToggle() {
        const app = document.getElementById('bd-app');
        const toggle = document.getElementById('bd-sidebar-toggle');
        const sidebar = document.getElementById('bd-sidebar');
        const backdrop = document.getElementById('bd-sidebar-backdrop');
        const isMobile = () => window.innerWidth <= 768;
        const KEY = 'bd_sidebar_collapsed';

        // Restore desktop state
        if (!isMobile() && localStorage.getItem(KEY) === '1')
            app?.classList.add('sidebar-collapsed');

        toggle?.addEventListener('click', () => {
            if (isMobile()) {
                sidebar?.classList.toggle('mobile-open');
                backdrop?.classList.toggle('active');
            } else {
                app?.classList.toggle('sidebar-collapsed');
                localStorage.setItem(KEY,
                    app?.classList.contains('sidebar-collapsed') ? '1' : '0');
            }
        });

        // Close on backdrop click
        backdrop?.addEventListener('click', () => {
            sidebar?.classList.remove('mobile-open');
            backdrop?.classList.remove('active');
        });

        // Close on resize
        window.addEventListener('resize', () => {
            if (!isMobile()) {
                sidebar?.classList.remove('mobile-open');
                backdrop?.classList.remove('active');
            }
        });
    }

    // ── Keyboard Shortcuts ─────────────────────────────────────
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K → Command palette
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('bd-command-palette')
                    ?.classList.toggle('d-none');
                document.getElementById('bd-command-input')?.focus();
            }
            // Ctrl+B → Sidebar toggle
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                document.getElementById('bd-sidebar-toggle')?.click();
            }
            // Escape → close overlays
            if (e.key === 'Escape') {
                document.getElementById('bd-command-palette')
                    ?.classList.add('d-none');
                document.querySelectorAll('.bd-dropdown')
                    .forEach(d => d.classList.add('d-none'));
            }
        });
    }

    // ── Dropdowns ──────────────────────────────────────────────
    function initDropdowns() {
        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            const target = e.target as Element;
            if (!target.closest('[data-dropdown-trigger]')) {
                document.querySelectorAll('.bd-dropdown')
                    .forEach(d => d.classList.add('d-none'));
            }
        });
    }

    // ── Session Guard ──────────────────────────────────────────
    function startSessionGuard() {
        const CHECK_INTERVAL = 30_000; // 30s

        setInterval(async () => {
            if (window.bdApi.isTokenExpiringSoon(3)) {
                window.bdEvents && showSessionWarning();
            }
        }, CHECK_INTERVAL);
    }

    function showSessionWarning() {
        // Kendo confirm dialog
        if (typeof kendo !== 'undefined') {
            kendo.confirm(
                'Your session will expire in 3 minutes. Continue working?'
            ).done(async () => {
                const ok = await window.bdApi.refreshToken();
                if (!ok) window.location.href = '/auth/login';
                else window.bdToast.success('Session extended successfully');
            }).fail(() => {
                window.location.href = '/auth/logout';
            });
        }
    }

    /**
     * Update breadcrumb on SPA navigation
     * Listen for clicks on partial-loaded links
     */
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a[data-partial="true"]');
        if (!link) return;

        const url = link.getAttribute('href');
        if (!url) return;

        // After content loads
        setTimeout(() => window.bdNav?.apply(url), 100);
    });

    // Browser back/forward
    window.addEventListener('popstate', () => {
        window.bdNav?.apply(window.location.pathname);
    });


    // ── Boot ───────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', bootShell);

})();
