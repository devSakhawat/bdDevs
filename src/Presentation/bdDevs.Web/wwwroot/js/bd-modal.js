/**
 * bd-modal.js — Generic Kendo Window Modal Wrapper
 * Step 7.6 — Interaction Components
 *
 * Usage:
 *   // Open a URL inside a modal
 *   bdModal.open({
 *       url:    '/crm/leads/create',
 *       title:  'New Lead',
 *       width:  700,
 *       height: 520,
 *       onClose: () => grid.dataSource.read(),
 *   });
 *
 *   // Open with inline content
 *   bdModal.open({
 *       content: '<p>Are you sure?</p>',
 *       title:   'Confirm',
 *       width:   400,
 *   });
 *
 *   // Close from inside the modal iframe/partial
 *   bdModal.close();
 *   bdModal.closeAndRefresh();  // closes + triggers onClose callback
 */

'use strict';

window.bdModal = (function () {

    const SIZE_PRESETS = {
        sm:   { width: 420,  height: 320 },
        md:   { width: 620,  height: 480 },
        lg:   { width: 860,  height: 620 },
        xl:   { width: 1060, height: 720 },
        full: { width: window.innerWidth  - 80, height: window.innerHeight - 80 },
    };

    let _currentWindow = null;
    let _onCloseCallback = null;
    let _idCounter = 0;

    // ─────────────────────────────────────────────────────────
    //  OPEN
    // ─────────────────────────────────────────────────────────
    /**
     * @param {object} opts
     * @param {string}   [opts.url]       – URL to load via iframe (Type 1: Kendo modal)
     * @param {string}   [opts.content]   – Inline HTML content
     * @param {string}   [opts.title]     – Window title
     * @param {number|string} [opts.width]  – px number or size preset key ('sm','md','lg','xl','full')
     * @param {number}   [opts.height]    – px number
     * @param {boolean}  [opts.resizable] – default true
     * @param {boolean}  [opts.draggable] – default true
     * @param {boolean}  [opts.modal]     – default true (show backdrop)
     * @param {Function} [opts.onClose]   – called when window closes
     * @param {Function} [opts.onOpen]    – called when window opens
     */
    function open(opts = {}) {
        // Close any existing modal first
        if (_currentWindow) {
            _currentWindow.destroy();
            _currentWindow = null;
        }

        // Resolve size
        let { width, height } = _resolveSize(opts);

        // Clamp to viewport
        const maxW = window.innerWidth  - 40;
        const maxH = window.innerHeight - 40;
        width  = Math.min(width,  maxW);
        height = Math.min(height, maxH);

        _onCloseCallback = opts.onClose || null;

        const id = 'bdModalWin_' + (++_idCounter);

        // Create host element
        const host = document.createElement('div');
        host.id = id;
        document.getElementById('bdModalHost').appendChild(host);

        // Build content
        let content;
        if (opts.url) {
            content = `<iframe
                src="${opts.url}"
                style="width:100%;height:100%;border:none;display:block;"
                frameborder="0"
                id="${id}_frame"
                name="${id}_frame"
            ></iframe>`;
        } else {
            content = opts.content || '';
        }

        // Init Kendo Window
        _currentWindow = $(host).kendoWindow({
            title:     opts.title || '',
            width:     width,
            height:    height,
            resizable: opts.resizable !== false,
            draggable: opts.draggable !== false,
            modal:     opts.modal !== false,
            animation: {
                open:  { effects: 'fade:in zoom:in', duration: 200 },
                close: { effects: 'fade:out zoom:out', duration: 150 },
            },
            content:   { template: content },
            close: function () {
                setTimeout(() => {
                    if (_currentWindow) {
                        _currentWindow.destroy();
                        _currentWindow = null;
                    }
                    host.remove();
                }, 180);

                if (_onCloseCallback) {
                    _onCloseCallback();
                    _onCloseCallback = null;
                }
            },
            open: function () {
                // Center on screen
                this.center();

                // Trap focus inside modal
                _trapFocus(host);

                if (opts.onOpen) opts.onOpen(this);
            },
        }).data('kendoWindow');

        _currentWindow.open();

        return _currentWindow;
    }

    // ─────────────────────────────────────────────────────────
    //  CLOSE
    // ─────────────────────────────────────────────────────────
    function close() {
        if (_currentWindow) {
            _currentWindow.close();
        }
    }

    /**
     * Close the modal AND trigger the onClose callback immediately.
     * Useful when called from inside the modal after a successful save.
     */
    function closeAndRefresh() {
        const cb = _onCloseCallback;
        _onCloseCallback = null; // prevent double-fire
        if (_currentWindow) {
            _currentWindow.close();
        }
        if (cb) cb();
    }

    // ─────────────────────────────────────────────────────────
    //  CONFIRM DIALOG
    // ─────────────────────────────────────────────────────────
    /**
     * Show a lightweight confirm dialog.
     * @param {object} opts
     * @param {string}   opts.title
     * @param {string}   opts.message
     * @param {string}   [opts.confirmLabel]  default 'Confirm'
     * @param {string}   [opts.confirmClass]  default 'bd-btn-danger'
     * @param {Function} opts.onConfirm
     * @param {Function} [opts.onCancel]
     */
    function confirm(opts = {}) {
        const confirmLabel = opts.confirmLabel || 'Confirm';
        const confirmClass = opts.confirmClass || 'bd-btn-danger';

        open({
            title:     opts.title || 'Confirm',
            width:     420,
            height:    'auto',
            resizable: false,
            content:   `
                <div style="padding:24px;">
                    <p style="margin:0 0 20px;color:var(--bd-text-secondary);font-size:.9rem;line-height:1.5;">
                        ${opts.message || 'Are you sure?'}
                    </p>
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button class="bd-btn bd-btn-ghost" id="_bdConfirmCancel">Cancel</button>
                        <button class="bd-btn ${confirmClass}" id="_bdConfirmOk">${confirmLabel}</button>
                    </div>
                </div>
            `,
            onOpen: function () {
                setTimeout(() => {
                    const ok     = document.getElementById('_bdConfirmOk');
                    const cancel = document.getElementById('_bdConfirmCancel');

                    if (ok) ok.addEventListener('click', () => {
                        close();
                        if (opts.onConfirm) opts.onConfirm();
                    });

                    if (cancel) cancel.addEventListener('click', () => {
                        close();
                        if (opts.onCancel) opts.onCancel();
                    });
                }, 50);
            }
        });
    }

    // ─────────────────────────────────────────────────────────
    //  SIZE RESOLVER
    // ─────────────────────────────────────────────────────────
    function _resolveSize(opts) {
        const preset = typeof opts.width === 'string' && SIZE_PRESETS[opts.width]
            ? SIZE_PRESETS[opts.width]
            : null;

        if (preset) return preset;

        return {
            width:  opts.width  || 640,
            height: opts.height || 480,
        };
    }

    // ─────────────────────────────────────────────────────────
    //  FOCUS TRAP (accessibility)
    // ─────────────────────────────────────────────────────────
    function _trapFocus(container) {
        const focusable = container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        // Focus first element
        setTimeout(() => first.focus(), 50);

        container.addEventListener('keydown', function handler(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
            }

            // Remove handler if modal is gone
            if (!container.isConnected) container.removeEventListener('keydown', handler);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  KEYBOARD: Escape to close
    // ─────────────────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && _currentWindow) {
            // Only close if no dirty form inside
            const frame = document.querySelector('[id$="_frame"]');
            let isDirty = false;

            if (frame && frame.contentWindow && frame.contentWindow.bdFormGuard) {
                isDirty = frame.contentWindow.bdFormGuard.isDirty();
            }

            if (!isDirty) {
                close();
            }
        }
    });

    // ─────────────────────────────────────────────────────────
    return {
        open, close, closeAndRefresh, confirm,
        getCurrent: () => _currentWindow,
    };

})();
