/**
 * toast.js — Toast Notification Service
 * Step 7.4 — Feedback System
 *
 * Usage:
 *   bdToast.success('Lead saved successfully.');
 *   bdToast.success('Assigned!', { title: 'Lead Assigned', action: { label: 'View', fn: () => openLead(id) } });
 *   bdToast.error('Failed to save.', { title: 'Error', duration: 0 }); // 0 = no auto-dismiss
 *   bdToast.warning('Unsaved changes detected.');
 *   bdToast.info('Email sent to 3 contacts.');
 */

'use strict';

window.bdToast = (function () {

    const HOST_ID = 'bdToastHost';
    const ICONS = {
        success: '✓',
        warning: '⚠',
        error:   '✕',
        info:    'ℹ',
    };
    const DURATIONS = {
        success: 4000,
        warning: 6000,
        error:   8000,
        info:    5000,
    };

    let _counter = 0;

    function _getHost() {
        return document.getElementById(HOST_ID);
    }

    /**
     * Show a toast.
     * @param {'success'|'warning'|'error'|'info'} type
     * @param {string} message
     * @param {object} [opts]
     * @param {string} [opts.title]
     * @param {number} [opts.duration]  ms, 0 = persistent
     * @param {object} [opts.action]   { label, fn }
     */
    function show(type, message, opts = {}) {
        const host = _getHost();
        if (!host) return;

        const id       = 'bdToast_' + (++_counter);
        const title    = opts.title || _capitalize(type);
        const duration = opts.duration !== undefined ? opts.duration : DURATIONS[type];
        const action   = opts.action;

        const toast = document.createElement('div');
        toast.id        = id;
        toast.className = `bd-toast bd-toast--${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        toast.innerHTML = `
            <div class="bd-toast-icon">${ICONS[type]}</div>
            <div class="bd-toast-body">
                <div class="bd-toast-title">${_escape(title)}</div>
                <div class="bd-toast-msg">${_escape(message)}</div>
                ${action ? `<button class="bd-toast-action" data-action="true">${_escape(action.label)}</button>` : ''}
            </div>
            <button class="bd-toast-close" data-close="true" aria-label="Dismiss">✕</button>
        `;

        // Action handler
        if (action) {
            toast.querySelector('[data-action]').addEventListener('click', () => {
                try { action.fn(); } catch(e){}
                _remove(id);
            });
        }

        // Close handler
        toast.querySelector('[data-close]').addEventListener('click', () => _remove(id));

        host.appendChild(toast);

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => _remove(id), duration);
        }

        return id;
    }

    function _remove(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('removing');
        setTimeout(() => el.remove(), 250);
    }

    function _escape(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function _capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // ── Public API ──
    return {
        show,
        success: (msg, opts) => show('success', msg, opts),
        warning: (msg, opts) => show('warning', msg, opts),
        error:   (msg, opts) => show('error',   msg, opts),
        info:    (msg, opts) => show('info',     msg, opts),
        dismiss: _remove,
    };

})();
