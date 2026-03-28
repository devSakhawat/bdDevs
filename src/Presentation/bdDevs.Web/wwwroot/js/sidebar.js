/**
 * sidebar.js — Sidebar Toggle, Navigation, Mobile Overlay
 * Step 7 — Updated (Step 6 base + Step 7 enhancements)
 *
 * Features:
 *   • Collapse/expand with icon-only mode
 *   • Mobile overlay mode
 *   • Active link sync from current URL
 *   • Menu item search filter
 *   • SPA-style AJAX loading (sidebar stays, content swaps)
 *   • Persist collapsed state
 *   • Keyboard: Ctrl+B = toggle
 */

'use strict';

window.bdSidebar = (function () {

    const LS_KEY        = 'bdSidebarCollapsed';
    const COLLAPSED_CLASS = 'sidebar-collapsed';
    const MOBILE_BP     = 768;

    let _isCollapsed = false;
    let _isMobile    = false;

    // ─────────────────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────────────────
    function init() {
        _isMobile    = window.innerWidth <= MOBILE_BP;
        _isCollapsed = !_isMobile && _loadState();

        _applyState(false); // no animation on init
        _syncActiveLink();
        _bindEvents();
        _initSearch();

        // Listen from event bus (mobile backdrop close)
        if (window.bdEvents) {
            bdEvents.on('sidebar:close', () => { if (_isMobile) _closeMobile(); });
        }
    }

    // ─────────────────────────────────────────────────────────
    //  TOGGLE
    // ─────────────────────────────────────────────────────────
    function toggle() {
        if (_isMobile) {
            _isCollapsed ? _openMobile() : _closeMobile();
        } else {
            _isCollapsed = !_isCollapsed;
            _applyState(true);
            _saveState(_isCollapsed);
        }
    }

    function _openMobile() {
        _isCollapsed = false;
        _applyState(true);
        const backdrop = document.getElementById('bdSidebarBackdrop');
        if (backdrop) backdrop.style.display = 'block';
    }

    function _closeMobile() {
        _isCollapsed = true;
        _applyState(true);
        const backdrop = document.getElementById('bdSidebarBackdrop');
        if (backdrop) backdrop.style.display = 'none';
    }

    // ─────────────────────────────────────────────────────────
    //  APPLY COLLAPSED STATE
    // ─────────────────────────────────────────────────────────
    function _applyState(animate) {
        const sidebar = document.getElementById('bdSidebar');
        const main    = document.getElementById('bdMain');
        const toggle  = document.getElementById('bdSidebarToggle');
        const topLeft = document.querySelector('.bd-topbar-left');

        if (sidebar) {
            if (!animate) sidebar.style.transition = 'none';
            sidebar.classList.toggle(COLLAPSED_CLASS, _isCollapsed);

            if (_isMobile) {
                sidebar.style.transform = _isCollapsed ? 'translateX(-100%)' : 'translateX(0)';
            }

            if (!animate) {
                requestAnimationFrame(() => {
                    sidebar.style.transition = '';
                });
            }
        }

        if (main)   main.classList.toggle(COLLAPSED_CLASS, _isCollapsed && !_isMobile);
        if (toggle) toggle.setAttribute('aria-expanded', (!_isCollapsed).toString());
        if (topLeft) topLeft.style.width = (!_isMobile && _isCollapsed)
            ? 'var(--bd-sidebar-collapsed-w)'
            : 'var(--bd-sidebar-w)';
    }

    // ─────────────────────────────────────────────────────────
    //  ACTIVE LINK
    // ─────────────────────────────────────────────────────────
    function _syncActiveLink() {
        const currentPath = window.location.pathname.toLowerCase();
        const links = document.querySelectorAll('#bdSidebar .bd-sidebar-link');

        links.forEach(link => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            const isActive = href !== '/' && currentPath.startsWith(href)
                || (href === '/' && currentPath === '/');

            link.classList.toggle('active', isActive);

            // Expand parent group if child is active
            if (isActive) {
                const group = link.closest('.bd-sidebar-group');
                if (group) {
                    group.classList.add('expanded');
                    const toggle = group.querySelector('.bd-group-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'true');
                }
            }
        });
    }

    // ─────────────────────────────────────────────────────────
    //  SIDEBAR SEARCH FILTER
    // ─────────────────────────────────────────────────────────
    function _initSearch() {
        const searchInput = document.getElementById('bdSidebarSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', function () {
            const q = this.value.toLowerCase().trim();
            const items = document.querySelectorAll('#bdSidebar .bd-sidebar-item');

            if (!q) {
                items.forEach(item => item.style.display = '');
                document.querySelectorAll('.bd-sidebar-group').forEach(g => g.style.display = '');
                return;
            }

            document.querySelectorAll('.bd-sidebar-group').forEach(group => {
                const links = group.querySelectorAll('.bd-sidebar-item');
                let groupHasMatch = false;

                links.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    const match = text.includes(q);
                    item.style.display = match ? '' : 'none';
                    if (match) groupHasMatch = true;
                });

                group.style.display = groupHasMatch ? '' : 'none';
                if (groupHasMatch) group.classList.add('expanded');
            });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  EVENT BINDING
    // ─────────────────────────────────────────────────────────
    function _bindEvents() {
        // Toggle button
        const btn = document.getElementById('bdSidebarToggle');
        if (btn) btn.addEventListener('click', toggle);

        // Resize handler
        window.addEventListener('resize', _onResize);

        // Keyboard: Ctrl+B
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggle();
            }
        });

        // Sub-menu group toggles
        document.querySelectorAll('.bd-group-toggle').forEach(btn => {
            btn.addEventListener('click', function () {
                const group = this.closest('.bd-sidebar-group');
                if (!group) return;
                const expanded = group.classList.toggle('expanded');
                this.setAttribute('aria-expanded', expanded.toString());
            });
        });

        // SPA nav: intercept sidebar links (optional — remove if using full page nav)
        // document.querySelectorAll('#bdSidebar .bd-sidebar-link[data-spa]').forEach(link => {
        //     link.addEventListener('click', _handleSpaNav);
        // });
    }

    function _onResize() {
        const wasMobile = _isMobile;
        _isMobile = window.innerWidth <= MOBILE_BP;

        if (wasMobile !== _isMobile) {
            // Switched breakpoint — reset state
            if (!_isMobile) {
                // Desktop: restore persisted state
                _isCollapsed = _loadState();
                const backdrop = document.getElementById('bdSidebarBackdrop');
                if (backdrop) backdrop.style.display = 'none';
            } else {
                // Mobile: always start collapsed (overlay mode)
                _isCollapsed = true;
            }
            _applyState(false);
        }
    }

    // ─────────────────────────────────────────────────────────
    //  PERSIST
    // ─────────────────────────────────────────────────────────
    function _loadState() {
        try { return localStorage.getItem(LS_KEY) === 'true'; } catch (_) { return false; }
    }

    function _saveState(val) {
        try { localStorage.setItem(LS_KEY, val); } catch (_) {}
    }

    // ─────────────────────────────────────────────────────────
    //  AUTO INIT
    // ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

    return { init, toggle, isCollapsed: () => _isCollapsed };

})();
