/**
 * command-palette.js — Command Palette (Ctrl+K)
 * Step 7.6 — Interaction Components
 *
 * Phase 1 commands:
 *   • Navigation: Go to Dashboard, Leads, Students, etc.
 *   • Actions: New Lead, Toggle Theme, Logout
 *   • Session: notifications, profile
 *
 * Phase 2 (extend later):
 *   • Global record search (lead/student by name)
 *   • Recent pages
 *   • Admin commands
 *
 * Usage:
 *   // Register custom page command:
 *   bdCommandPalette.register({
 *       id: 'lead:new', label: 'New Lead',
 *       icon: '➕', shortcut: 'Ctrl+N',
 *       action: () => bdModal.open({ url: '/crm/leads/create', title: 'New Lead', width: 'lg' })
 *   });
 */

'use strict';

window.bdCommandPalette = (function () {

    // ─────────────────────────────────────────────────────────
    //  BUILT-IN COMMANDS
    // ─────────────────────────────────────────────────────────
    const _builtinCommands = [
        // ── Navigation ──
        { id: 'nav:dashboard',  label: 'Go to Dashboard',   icon: '📊', group: 'Navigation', shortcut: '',        action: () => _goto('/') },
        { id: 'nav:leads',      label: 'Go to Leads',        icon: '🎯', group: 'Navigation', shortcut: '',        action: () => _goto('/crm/leads') },
        { id: 'nav:students',   label: 'Go to Students',     icon: '👥', group: 'Navigation', shortcut: '',        action: () => _goto('/crm/students') },
        { id: 'nav:apps',       label: 'Go to Applications', icon: '📋', group: 'Navigation', shortcut: '',        action: () => _goto('/crm/applications') },
        { id: 'nav:admin',      label: 'Go to Admin',        icon: '⚙️',  group: 'Navigation', shortcut: '',        action: () => _goto('/admin') },
        // ── Actions ──
        { id: 'action:new',     label: 'New Item',           icon: '➕', group: 'Actions',    shortcut: 'Ctrl+N',  action: () => bdEvents.emit('page:new') },
        { id: 'action:search',  label: 'Search Page',        icon: '🔍', group: 'Actions',    shortcut: 'Ctrl+/',  action: () => bdEvents.emit('page:search') },
        { id: 'action:refresh', label: 'Refresh Page',       icon: '🔄', group: 'Actions',    shortcut: '',        action: () => location.reload() },
        // ── Appearance ──
        { id: 'theme:dark',     label: 'Switch to Dark Mode',  icon: '🌙', group: 'Appearance', shortcut: '', action: () => bdTheme.setMode('dark') },
        { id: 'theme:light',    label: 'Switch to Light Mode',  icon: '☀️', group: 'Appearance', shortcut: '', action: () => bdTheme.setMode('light') },
        { id: 'theme:compact',  label: 'Compact Density',      icon: '▤',  group: 'Appearance', shortcut: '', action: () => bdTheme.setDensity('compact') },
        { id: 'theme:comfortable', label: 'Comfortable Density', icon: '▥', group: 'Appearance', shortcut: '', action: () => bdTheme.setDensity('comfortable') },
        // ── Session ──
        { id: 'session:profile',  label: 'My Profile',         icon: '👤', group: 'Session',    shortcut: '',       action: () => _goto('/account/profile') },
        { id: 'session:notifs',   label: 'Open Notifications',  icon: '🔔', group: 'Session',    shortcut: '',       action: () => bdEvents.emit('notification:toggle') },
        { id: 'session:logout',   label: 'Logout',              icon: '🚪', group: 'Session',    shortcut: 'Ctrl+Shift+Q', action: _logout },
    ];

    let _customCommands = [];
    let _recentIds      = _loadRecent();
    let _activeIndex    = -1;
    let _filtered       = [];
    let _isOpen         = false;

    // ─────────────────────────────────────────────────────────
    //  REGISTER CUSTOM COMMAND
    // ─────────────────────────────────────────────────────────
    function register(cmd) {
        // Remove if already exists (re-register)
        _customCommands = _customCommands.filter(c => c.id !== cmd.id);
        _customCommands.push(cmd);
    }

    function unregister(id) {
        _customCommands = _customCommands.filter(c => c.id !== id);
    }

    function _allCommands() {
        return [..._builtinCommands, ..._customCommands];
    }

    // ─────────────────────────────────────────────────────────
    //  OPEN / CLOSE
    // ─────────────────────────────────────────────────────────
    function open() {
        const backdrop = document.getElementById('bdCpBackdrop');
        const palette  = document.getElementById('bdCommandPalette');
        const input    = document.getElementById('bdCpInput');

        if (!palette) return;

        backdrop.style.display = 'block';
        palette.style.display  = 'flex';
        _isOpen = true;

        // Reset
        if (input) { input.value = ''; input.focus(); }
        _activeIndex = -1;
        _renderRecent();
        _renderCommands('');
    }

    function close() {
        const backdrop = document.getElementById('bdCpBackdrop');
        const palette  = document.getElementById('bdCommandPalette');

        if (backdrop) backdrop.style.display = 'none';
        if (palette)  palette.style.display  = 'none';
        _isOpen = false;
        _activeIndex = -1;
    }

    // ─────────────────────────────────────────────────────────
    //  FUZZY MATCH SCORING
    // ─────────────────────────────────────────────────────────
    /**
     * Calculate fuzzy match score for a string against a query
     * @param {string} str - The string to match against
     * @param {string} query - The search query
     * @returns {number} Match score (higher is better, 0 means no match)
     */
    function _fuzzyScore(str, query) {
        str = str.toLowerCase();
        query = query.toLowerCase();

        // Exact match gets highest score
        if (str === query) return 1000;

        // Starts with query gets high score
        if (str.startsWith(query)) return 900;

        let score = 0;
        let queryIndex = 0;
        let lastMatchIndex = -1;

        // Check each character of query
        for (let i = 0; i < str.length && queryIndex < query.length; i++) {
            if (str[i] === query[queryIndex]) {
                // Consecutive matches get bonus
                if (lastMatchIndex === i - 1) {
                    score += 10;
                }
                // Match at word boundary gets bonus
                if (i === 0 || str[i - 1] === ' ' || str[i - 1] === '-') {
                    score += 8;
                }
                score += 5;
                lastMatchIndex = i;
                queryIndex++;
            }
        }

        // Return score only if all query characters were matched
        return queryIndex === query.length ? score : 0;
    }

    // ─────────────────────────────────────────────────────────
    //  SEARCH WITH FUZZY MATCHING
    // ─────────────────────────────────────────────────────────
    /**
     * Search commands with fuzzy matching
     * @param {string} query - Search query
     */
    function _search(query) {
        if (!query.trim()) {
            _renderRecent();
            _renderCommands('');
            _hideEmpty();
            return;
        }

        const q = query.toLowerCase();
        const allCmds = _allCommands();

        // Calculate scores for each command
        const scored = allCmds.map(cmd => {
            const labelScore = _fuzzyScore(cmd.label, q);
            const groupScore = _fuzzyScore(cmd.group || '', q) * 0.5;
            const idScore = _fuzzyScore(cmd.id, q) * 0.3;

            return {
                cmd,
                score: Math.max(labelScore, groupScore, idScore)
            };
        }).filter(item => item.score > 0);

        // Sort by score (highest first)
        scored.sort((a, b) => b.score - a.score);

        _filtered = scored.map(item => item.cmd);

        // Hide recent when searching
        const recentSection = document.getElementById('bdCpRecent');
        if (recentSection) recentSection.style.display = 'none';

        if (!_filtered.length) {
            const emptyEl = document.getElementById('bdCpEmpty');
            const queryEl = document.getElementById('bdCpQuery');
            if (emptyEl) emptyEl.style.display = 'flex';
            if (queryEl) queryEl.textContent = query;
            document.getElementById('bdCpCommandItems').innerHTML = '';
            return;
        }

        _hideEmpty();
        _renderItems('bdCpCommandItems', _filtered);
        _activeIndex = -1;
    }

    // ─────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────
    function _renderRecent() {
        const section  = document.getElementById('bdCpRecent');
        const itemsEl  = document.getElementById('bdCpRecentItems');
        if (!section || !itemsEl) return;

        const recent = _recentIds
            .map(id => _allCommands().find(c => c.id === id))
            .filter(Boolean)
            .slice(0, 5);

        if (!recent.length) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        _renderItems('bdCpRecentItems', recent);
    }

    function _renderCommands(query) {
        const section  = document.getElementById('bdCpCommands');
        const itemsEl  = document.getElementById('bdCpCommandItems');
        if (!section || !itemsEl) return;

        const cmds = query
            ? _filtered
            : _allCommands();

        section.style.display = 'block';
        _renderItems('bdCpCommandItems', cmds);
    }

    function _renderItems(containerId, cmds) {
        const el = document.getElementById(containerId);
        if (!el) return;

        el.innerHTML = cmds.map((cmd, i) => `
            <button class="bd-cp-item" data-id="${cmd.id}" role="option">
                <div class="bd-cp-item-icon">${cmd.icon || '▸'}</div>
                <div class="bd-cp-item-body">
                    <div class="bd-cp-item-label">${_esc(cmd.label)}</div>
                    ${cmd.desc ? `<div class="bd-cp-item-desc">${_esc(cmd.desc)}</div>` : ''}
                </div>
                ${cmd.shortcut ? `<kbd class="bd-cp-item-shortcut">${cmd.shortcut}</kbd>` : ''}
            </button>
        `).join('');

        el.querySelectorAll('.bd-cp-item').forEach(btn => {
            btn.addEventListener('click', () => _runCommand(btn.dataset.id));
            btn.addEventListener('mouseenter', () => {
                el.querySelectorAll('.bd-cp-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    function _hideEmpty() {
        const el = document.getElementById('bdCpEmpty');
        if (el) el.style.display = 'none';
    }

    // ─────────────────────────────────────────────────────────
    //  KEYBOARD NAVIGATION
    // ─────────────────────────────────────────────────────────
    function _handleKeydown(e) {
        const items = document.querySelectorAll('#bdCommandPalette .bd-cp-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            _activeIndex = (_activeIndex + 1) % items.length;
            _updateActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            _activeIndex = (_activeIndex - 1 + items.length) % items.length;
            _updateActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const active = document.querySelector('#bdCommandPalette .bd-cp-item.active');
            if (active) _runCommand(active.dataset.id);
        }
    }

    function _updateActive(items) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === _activeIndex);
            if (i === _activeIndex) item.scrollIntoView({ block: 'nearest' });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  EXECUTE COMMAND
    // ─────────────────────────────────────────────────────────
    function _runCommand(id) {
        const cmd = _allCommands().find(c => c.id === id);
        if (!cmd) return;

        close();

        // Track in recent
        _recentIds = [id, ..._recentIds.filter(r => r !== id)].slice(0, 8);
        _saveRecent(_recentIds);

        // Execute
        try {
            cmd.action();
        } catch (err) {
            console.error('[bdCommandPalette] Command error:', err);
        }
    }

    // ─────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────
    function _goto(url) { window.location.href = url; }

    async function _logout() {
        try { await bdApi.post('/auth/logout', {}); } catch(_) {}
        window.location.href = '/account/login';
    }

    function _esc(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function _loadRecent() {
        try { return JSON.parse(localStorage.getItem('bdCpRecent') || '[]'); } catch (_) { return []; }
    }

    function _saveRecent(ids) {
        try { localStorage.setItem('bdCpRecent', JSON.stringify(ids)); } catch (_) {}
    }

    // ─────────────────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────────────────
    function init() {
        // Input handler
        const input = document.getElementById('bdCpInput');
        if (input) {
            input.addEventListener('input', () => _search(input.value));
            input.addEventListener('keydown', _handleKeydown);
        }

        // Backdrop click
        const backdrop = document.getElementById('bdCpBackdrop');
        if (backdrop) backdrop.addEventListener('click', close);

        // Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && _isOpen) { e.stopPropagation(); close(); }
        });

        // Ctrl+K global shortcut
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                _isOpen ? close() : open();
            }
        });

        // Event bus hook (search trigger button uses this)
        if (window.bdEvents) {
            bdEvents.on('commandpalette:open', open);
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    return { open, close, register, unregister };

})();
