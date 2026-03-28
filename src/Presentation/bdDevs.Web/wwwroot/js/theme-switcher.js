/**
 * theme-switcher.js — Theme Platform
 * Step 7.3 — Theme Platform
 *
 * Handles:
 *   • Family switch  (default / bootstrap / material / fluent)
 *   • Mode switch    (light / dark)
 *   • Density switch (compact / comfortable)
 *   • Kendo CDN link swap (no page reload)
 *   • Persists to DB via PUT /api/user/theme
 *   • localStorage fallback for instant apply on next load
 */

'use strict';

window.bdTheme = (function () {

    // ── Kendo CDN map ──
    const KENDO_CDN = 'https://kendo.cdn.telerik.com/themes/8.0.1';
    const KENDO_URLS = {
        'default-light':    `${KENDO_CDN}/default/default-main.css`,
        'default-dark':     `${KENDO_CDN}/default/default-dark.css`,
        'bootstrap-light':  `${KENDO_CDN}/bootstrap/bootstrap-main.css`,
        'bootstrap-dark':   `${KENDO_CDN}/bootstrap/bootstrap-dark.css`,
        'material-light':   `${KENDO_CDN}/material/material-main.css`,
        'material-dark':    `${KENDO_CDN}/material/material-dark.css`,
        'fluent-light':     `${KENDO_CDN}/fluent/fluent-main.css`,
        'fluent-dark':      `${KENDO_CDN}/fluent/fluent-dark.css`,
    };

    const LS_KEY = 'bdThemePrefs';

    // ── Current state ──
    let _state = {
        family:  'default',
        mode:    'light',
        density: 'comfortable',
    };

    // ─────────────────────────────────────────────────────────
    //  INIT — apply theme as early as possible
    // ─────────────────────────────────────────────────────────
    function init() {
        // Priority order: server config > localStorage > OS preference
        const cfg = window.bdConfig || {};
        const ls  = _loadFromStorage();

        _state.family  = cfg.themeFamily  || ls.family  || _detectFamily();
        _state.mode    = cfg.themeMode    || ls.mode    || _detectMode();
        _state.density = cfg.density      || ls.density || 'comfortable';

        // Apply immediately (before DOM fully renders)
        _applyToDOM();

        // Wire up the theme picker UI after DOM ready
        document.addEventListener('DOMContentLoaded', _initPicker);
    }

    // ─────────────────────────────────────────────────────────
    //  APPLY TO DOM
    // ─────────────────────────────────────────────────────────
    function _applyToDOM() {
        const html = document.documentElement;
        html.setAttribute('data-theme-family', _state.family);
        html.setAttribute('data-theme-mode',   _state.mode);
        html.setAttribute('data-density',      _state.density);

        // Swap Kendo CSS link
        const kendoLink = document.getElementById('kendo-theme');
        if (kendoLink) {
            const key = `${_state.family}-${_state.mode}`;
            const url = KENDO_URLS[key] || KENDO_URLS['default-light'];
            if (kendoLink.href !== url) {
                kendoLink.href = url;
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    //  THEME PICKER UI
    // ─────────────────────────────────────────────────────────
    function _initPicker() {
        _syncChips();

        // Family chips
        document.querySelectorAll('#bdThemeFamilyChips .bd-chip').forEach(btn => {
            btn.addEventListener('click', () => setFamily(btn.dataset.family));
        });

        // Mode chips
        document.querySelectorAll('#bdThemeModeChips .bd-chip').forEach(btn => {
            btn.addEventListener('click', () => setMode(btn.dataset.mode));
        });

        // Density chips
        document.querySelectorAll('#bdThemeDensityChips .bd-chip').forEach(btn => {
            btn.addEventListener('click', () => setDensity(btn.dataset.density));
        });
    }

    function _syncChips() {
        // Family
        document.querySelectorAll('#bdThemeFamilyChips .bd-chip').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.family === _state.family);
        });
        // Mode
        document.querySelectorAll('#bdThemeModeChips .bd-chip').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === _state.mode);
        });
        // Density
        document.querySelectorAll('#bdThemeDensityChips .bd-chip').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.density === _state.density);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  SET METHODS
    // ─────────────────────────────────────────────────────────
    function setFamily(family) {
        _state.family = family;
        _applyToDOM();
        _syncChips();
        _persist();
    }

    function setMode(mode) {
        _state.mode = mode;
        _applyToDOM();
        _syncChips();
        _persist();
    }

    function setDensity(density) {
        _state.density = density;
        _applyToDOM();
        _syncChips();
        _persist();
    }

    function set(family, mode, density) {
        _state.family  = family  || _state.family;
        _state.mode    = mode    || _state.mode;
        _state.density = density || _state.density;
        _applyToDOM();
        _syncChips();
        _persist();
    }

    // ─────────────────────────────────────────────────────────
    //  PERSIST (localStorage + DB)
    // ─────────────────────────────────────────────────────────
    let _saveTimer = null;

    function _persist() {
        // 1. localStorage (instant, for next page load)
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(_state));
        } catch (_) {}

        // 2. DB save (debounced — don't spam the API)
        clearTimeout(_saveTimer);
        _saveTimer = setTimeout(_saveToDB, 800);

        // 3. Notify other modules
        if (window.bdEvents) bdEvents.emit('theme:changed', { ..._state });
    }

    async function _saveToDB() {
        try {
            if (!window.bdApi) return;
            await bdApi.put('/user/theme', {
                themeFamily: _state.family,
                themeMode:   _state.mode,
                density:     _state.density,
            });
        } catch (err) {
            // Fail silently — localStorage already has it
            console.warn('[bdTheme] Could not persist theme to server:', err.message);
        }
    }

    // ─────────────────────────────────────────────────────────
    //  DETECT OS PREFERENCE
    // ─────────────────────────────────────────────────────────
    function _detectMode() {
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? 'dark'
            : 'light';
    }

    function _detectFamily() {
        return 'default';
    }

    function _loadFromStorage() {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        } catch (_) {
            return {};
        }
    }

    // ─────────────────────────────────────────────────────────
    //  TOGGLE DARK MODE (convenience)
    // ─────────────────────────────────────────────────────────
    function toggleMode() {
        setMode(_state.mode === 'light' ? 'dark' : 'light');
    }

    // Run init immediately (before DOMContentLoaded for fastest application)
    init();

    return {
        init, set, setFamily, setMode, setDensity, toggleMode,
        getState: () => ({ ..._state }),
    };

})();
