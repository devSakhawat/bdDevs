/**
 * loading.js — 3-Level Loading Strategy
 * Step 7.4 — Feedback System
 *
 * Level 1: App Shell Loading  → full skeleton (handled in _Layout.cshtml)
 * Level 2: Page Loading       → NProgress slim top bar
 * Level 3: Component Loading  → spinner overlay on grid/panel/button
 */

'use strict';

window.bdLoading = (function () {

    // ── NProgress config ──
    if (typeof NProgress !== 'undefined') {
        NProgress.configure({
            showSpinner: false,
            speed: 300,
            minimum: 0.1,
            trickleSpeed: 200,
            parent: '#bdTopbar',
        });
    }

    // ─────────────────────────────────────────────────────────
    //  LEVEL 2: PAGE LOADING  (NProgress top bar)
    // ─────────────────────────────────────────────────────────
    const page = {
        _count: 0,

        start() {
            this._count++;
            if (typeof NProgress !== 'undefined') NProgress.start();
        },

        done() {
            this._count = Math.max(0, this._count - 1);
            if (this._count === 0 && typeof NProgress !== 'undefined') {
                NProgress.done();
            }
        },

        inc() {
            if (typeof NProgress !== 'undefined') NProgress.inc();
        }
    };

    // ─────────────────────────────────────────────────────────
    //  LEVEL 3: COMPONENT LOADING  (spinner overlay on element)
    // ─────────────────────────────────────────────────────────
    const component = {

        /**
         * Show spinner overlay on a container element.
         * @param {string|Element} target - element id or DOM element
         * @param {string} [size='md'] - 'sm' | 'md' | 'lg'
         */
        show(target, size = 'md') {
            const el = typeof target === 'string'
                ? document.getElementById(target)
                : target;

            if (!el) return;
            if (el.querySelector('.bd-component-loader')) return; // already shown

            el.style.position = el.style.position || 'relative';

            const sizes = { sm: 20, md: 32, lg: 44 };
            const px = sizes[size] || 32;

            const overlay = document.createElement('div');
            overlay.className = 'bd-component-loader';
            overlay.style.cssText = `
                position: absolute; inset: 0;
                display: flex; align-items: center; justify-content: center;
                background: rgba(var(--bd-bg-surface-rgb, 255,255,255), 0.7);
                z-index: 10;
                border-radius: inherit;
                backdrop-filter: blur(1px);
            `;
            overlay.innerHTML = `
                <div style="
                    width: ${px}px; height: ${px}px;
                    border: 3px solid var(--bd-border-light);
                    border-top-color: var(--bd-accent);
                    border-radius: 50%;
                    animation: bdSpin 0.7s linear infinite;
                "></div>
            `;
            el.appendChild(overlay);
        },

        /**
         * Remove spinner overlay from element.
         */
        hide(target) {
            const el = typeof target === 'string'
                ? document.getElementById(target)
                : target;

            if (!el) return;
            const loader = el.querySelector('.bd-component-loader');
            if (loader) loader.remove();
        },

        /**
         * Show skeleton placeholder rows in a container.
         * @param {string|Element} target
         * @param {number} rows - number of skeleton rows to show
         */
        skeleton(target, rows = 3) {
            const el = typeof target === 'string'
                ? document.getElementById(target)
                : target;

            if (!el) return;

            const frag = document.createDocumentFragment();
            for (let i = 0; i < rows; i++) {
                const row = document.createElement('div');
                const w = [60, 45, 75, 55, 80][i % 5];
                row.style.cssText = `
                    height: 14px;
                    width: ${w}%;
                    border-radius: 4px;
                    background: var(--bd-skeleton-base);
                    margin-bottom: 10px;
                    animation: bdShimmer 1.5s infinite;
                `;
                frag.appendChild(row);
            }
            el.innerHTML = '';
            el.appendChild(frag);
        }
    };

    // ─────────────────────────────────────────────────────────
    //  BUTTON LOADING STATE
    // ─────────────────────────────────────────────────────────
    const button = {
        /**
         * Set button to loading state (disables + shows spinner).
         * @param {HTMLElement|string} btn
         * @returns {Function} restore - call to reset button
         */
        start(btn) {
            const el = typeof btn === 'string' ? document.getElementById(btn) : btn;
            if (!el) return () => {};

            const originalHTML = el.innerHTML;
            el.classList.add('loading');
            el.disabled = true;

            return function restore() {
                el.innerHTML = originalHTML;
                el.classList.remove('loading');
                el.disabled = false;
            };
        }
    };

    // ─────────────────────────────────────────────────────────
    //  HELPERS: wrap async action with loading
    // ─────────────────────────────────────────────────────────
    async function withPageLoader(fn) {
        page.start();
        try {
            return await fn();
        } finally {
            page.done();
        }
    }

    async function withButtonLoader(btnEl, fn) {
        const restore = button.start(btnEl);
        try {
            return await fn();
        } finally {
            restore();
        }
    }

    // NProgress CSS override (match theme accent)
    function _applyProgressColor() {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--bd-progress-color').trim();
        if (color) {
            let style = document.getElementById('bdProgressStyle');
            if (!style) {
                style = document.createElement('style');
                style.id = 'bdProgressStyle';
                document.head.appendChild(style);
            }
            style.textContent = `
                #nprogress .bar { background: ${color} !important; }
                #nprogress .peg { box-shadow: 0 0 10px ${color}, 0 0 5px ${color} !important; }
            `;
        }
    }

    // Re-apply color when theme changes
    if (window.bdEvents) {
        bdEvents.on('theme:changed', _applyProgressColor);
    }

    document.addEventListener('DOMContentLoaded', _applyProgressColor);

    // ─────────────────────────────────────────────────────────
    return { page, component, button, withPageLoader, withButtonLoader };

})();
