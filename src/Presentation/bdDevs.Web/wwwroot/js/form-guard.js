/**
 * form-guard.js — Form Dirty Check + Validation UX
 * Step 7.5 — Session + Security UX
 *
 * Features:
 *   • Dirty check — warns on navigate/close if unsaved changes
 *   • Scroll to first invalid field on submit
 *   • Duplicate submit prevention
 *   • Ctrl+S = save
 *   • Required field * highlight on submit
 *
 * Usage:
 *   // Auto-init all forms with data-bd-guard attribute:
 *   <form data-bd-guard data-bd-guard-submit="#btnSave">
 *
 *   // Manual init:
 *   const guard = bdFormGuard.init('#myForm', { onSubmit: handleSave });
 *   guard.isDirty();    // → boolean
 *   guard.markClean();  // call after successful save
 *   guard.destroy();
 */

'use strict';

window.bdFormGuard = (function () {

    const _guards = new Map(); // formEl → guardInstance

    // ─────────────────────────────────────────────────────────
    //  INIT A SINGLE FORM
    // ─────────────────────────────────────────────────────────
    /**
     * @param {string|HTMLElement} formSelector
     * @param {object} [opts]
     * @param {Function} [opts.onSubmit]    – async fn; return false to abort
     * @param {string}   [opts.submitBtn]   – selector for submit button
     * @param {boolean}  [opts.ctrlS]       – enable Ctrl+S shortcut (default true)
     * @param {boolean}  [opts.warnOnLeave] – warn on page unload (default true)
     */
    function init(formSelector, opts = {}) {
        const form = typeof formSelector === 'string'
            ? document.querySelector(formSelector)
            : formSelector;

        if (!form || _guards.has(form)) return _guards.get(form);

        let _dirty     = false;
        let _submitting = false;
        let _snapshot  = _takeSnapshot(form);

        // ── DIRTY TRACKING ──────────────────────────────────
        function _onChange() {
            const now = _takeSnapshot(form);
            _dirty = (now !== _snapshot);
            _updateDirtyUI();
        }

        form.addEventListener('input',  _onChange);
        form.addEventListener('change', _onChange);

        function _updateDirtyUI() {
            const saveBar = form.querySelector('.bd-form-save-bar');
            if (saveBar) {
                saveBar.style.opacity = _dirty ? '1' : '0';
                saveBar.style.pointerEvents = _dirty ? 'all' : 'none';
            }
        }

        // ── NAVIGATE AWAY WARNING ────────────────────────────
        function _beforeUnload(e) {
            if (_dirty && opts.warnOnLeave !== false) {
                e.preventDefault();
                e.returnValue = '';
            }
        }

        window.addEventListener('beforeunload', _beforeUnload);

        // ── SCROLL TO FIRST INVALID ──────────────────────────
        function _scrollToFirstInvalid() {
            // Kendo validation summary
            const summary = form.querySelector('.k-validation-summary');
            if (summary && summary.children.length) {
                summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Native invalid fields
            const invalid = form.querySelector('[data-val-required]:placeholder-shown, .k-invalid, .invalid, [aria-invalid="true"]');
            if (invalid) {
                invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                invalid.focus();
            }
        }

        // ── HIGHLIGHT REQUIRED FIELDS ────────────────────────
        function _highlightRequiredFields() {
            // Native required
            form.querySelectorAll('[required], [data-val-required]').forEach(field => {
                const val = field.value?.trim();
                if (!val) {
                    field.classList.add('invalid');
                    // Kendo style
                    const kendoWrapper = $(field).closest('.k-widget');
                    if (kendoWrapper.length) kendoWrapper.addClass('k-invalid');
                }
            });
        }

        // ── SUBMIT HANDLING ──────────────────────────────────
        async function _handleSubmit(e) {
            if (e) e.preventDefault();
            if (_submitting) return;

            // Find submit button
            const submitBtnSel = opts.submitBtn || form.dataset.bdGuardSubmit;
            const submitBtn = submitBtnSel
                ? (document.querySelector(submitBtnSel) || form.querySelector('[type="submit"]'))
                : form.querySelector('[type="submit"], .bd-btn-primary');

            // Validate Kendo form if present
            const kendoValidator = form.dataset.kendoValidator
                ? $(form).data('kendoValidator')
                : null;

            if (kendoValidator && !kendoValidator.validate()) {
                _highlightRequiredFields();
                _scrollToFirstInvalid();
                return;
            }

            if (submitBtn) submitBtn.classList.add('loading');
            _submitting = true;

            try {
                let result;
                if (opts.onSubmit) {
                    result = await opts.onSubmit(form);
                    if (result === false) return;
                }
                // Mark clean after success
                markClean();
            } catch (err) {
                console.error('[bdFormGuard] Submit error:', err);
            } finally {
                _submitting = false;
                if (submitBtn) submitBtn.classList.remove('loading');
            }
        }

        form.addEventListener('submit', _handleSubmit);

        // ── CTRL+S SHORTCUT ──────────────────────────────────
        function _onKeydown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                _handleSubmit(null);
            }
        }

        if (opts.ctrlS !== false) {
            form.addEventListener('keydown', _onKeydown);
        }

        // ── PUBLIC INSTANCE ──────────────────────────────────
        function markClean() {
            _snapshot = _takeSnapshot(form);
            _dirty = false;
            _updateDirtyUI();

            // Remove invalid states
            form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        }

        function isDirty() { return _dirty; }

        function destroy() {
            form.removeEventListener('input',  _onChange);
            form.removeEventListener('change', _onChange);
            form.removeEventListener('submit', _handleSubmit);
            form.removeEventListener('keydown', _onKeydown);
            window.removeEventListener('beforeunload', _beforeUnload);
            _guards.delete(form);
        }

        const instance = { isDirty, markClean, destroy, submit: _handleSubmit };
        _guards.set(form, instance);
        return instance;
    }

    // ─────────────────────────────────────────────────────────
    //  SNAPSHOT — serialize form values for dirty comparison
    // ─────────────────────────────────────────────────────────
    function _takeSnapshot(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        const data = {};
        fields.forEach(f => {
            if (f.type === 'checkbox') data[f.name || f.id] = f.checked;
            else if (f.type === 'radio') { if (f.checked) data[f.name] = f.value; }
            else data[f.name || f.id] = f.value;
        });
        return JSON.stringify(data);
    }

    // ─────────────────────────────────────────────────────────
    //  UNSAVED CHANGES CONFIRM  (for SPA navigation)
    // ─────────────────────────────────────────────────────────
    function confirmNavigation(onProceed) {
        const hasAnyDirty = [..._guards.values()].some(g => g.isDirty());

        if (!hasAnyDirty) {
            onProceed();
            return;
        }

        bdModal.confirm({
            title:        'Unsaved Changes',
            message:      'You have unsaved changes. If you leave now, your changes will be lost.',
            confirmLabel: 'Leave Anyway',
            confirmClass: 'bd-btn-danger',
            onConfirm:    onProceed,
        });
    }

    // ─────────────────────────────────────────────────────────
    //  GLOBAL DIRTY CHECK  (for session-guard, modal Escape, etc.)
    // ─────────────────────────────────────────────────────────
    function isDirty() {
        return [..._guards.values()].some(g => g.isDirty());
    }

    // ─────────────────────────────────────────────────────────
    //  AUTO-INIT  on DOMContentLoaded
    // ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-bd-guard]').forEach(form => {
            init(form);
        });
    });

    // ─────────────────────────────────────────────────────────
    return { init, isDirty, confirmNavigation };

})();
