/**
 * session-guard.js — JWT Session Guard
 * Step 7.5 — Session + Security UX
 *
 * Behavior:
 *   • Watches JWT expiry from window.bdConfig.jwtExpiresAt
 *   • 3 minutes before expiry → shows warning modal
 *   • "Continue" → silent token refresh via /api/auth/refresh
 *   • "Logout" or timeout → redirects to login
 *   • Modal auto-closes on successful refresh
 */

'use strict';

window.bdSessionGuard = (function () {

    const WARN_BEFORE_MS  = 3 * 60 * 1000;  // 3 minutes
    const CHECK_INTERVAL  = 30 * 1000;       // check every 30s
    const COUNTDOWN_MS    = 3 * 60 * 1000;   // countdown from 3:00

    let _warningTimer    = null;
    let _countdownTimer  = null;
    let _checkTimer      = null;
    let _expiresAt       = null;
    let _isWarning       = false;

    // ─────────────────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────────────────
    function init() {
        const cfg = window.bdConfig || {};
        const expiresAtStr = cfg.jwtExpiresAt;

        if (!expiresAtStr) return;

        try {
            _expiresAt = new Date(expiresAtStr).getTime();
        } catch (_) {
            return;
        }

        if (isNaN(_expiresAt)) return;

        _bindUI();
        _scheduleWarning();
        _startPeriodicCheck();

        // Listen for auth:unauthorized from apiService
        if (window.bdEvents) {
            bdEvents.on('auth:unauthorized', () => {
                _showModal('Your session has expired. Please log in again.');
            });
        }
    }

    // ─────────────────────────────────────────────────────────
    //  SCHEDULING
    // ─────────────────────────────────────────────────────────
    function _scheduleWarning() {
        if (_warningTimer) clearTimeout(_warningTimer);
        const now       = Date.now();
        const warnAt    = _expiresAt - WARN_BEFORE_MS;
        const delay     = warnAt - now;

        if (delay <= 0) {
            // Already within warning window
            _showModal();
        } else {
            _warningTimer = setTimeout(() => _showModal(), delay);
        }
    }

    function _startPeriodicCheck() {
        _checkTimer = setInterval(() => {
            if (_expiresAt && Date.now() >= _expiresAt) {
                _forceLogout();
            }
        }, CHECK_INTERVAL);
    }

    // ─────────────────────────────────────────────────────────
    //  MODAL
    // ─────────────────────────────────────────────────────────
    function _showModal(customMsg) {
        if (_isWarning) return;
        _isWarning = true;

        const modal = document.getElementById('bdSessionModal');
        if (!modal) return;

        modal.style.display = 'flex';

        if (customMsg) {
            const msgEl = document.getElementById('bdSessionModalMsg');
            if (msgEl) msgEl.innerHTML = customMsg;
            return;
        }

        // Start countdown
        _startCountdown();
    }

    function _hideModal() {
        const modal = document.getElementById('bdSessionModal');
        if (modal) modal.style.display = 'none';
        _isWarning = false;
        if (_countdownTimer) { clearInterval(_countdownTimer); _countdownTimer = null; }
    }

    function _startCountdown() {
        const countdownEl = document.getElementById('bdSessionCountdown');
        let remaining = COUNTDOWN_MS;

        function _update() {
            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            if (countdownEl) {
                countdownEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            if (remaining <= 0) {
                clearInterval(_countdownTimer);
                _forceLogout();
            }
            remaining -= 1000;
        }

        _update();
        _countdownTimer = setInterval(_update, 1000);
    }

    // ─────────────────────────────────────────────────────────
    //  ACTIONS
    // ─────────────────────────────────────────────────────────
    async function _handleContinue() {
        const btn = document.getElementById('bdSessionContinue');
        if (btn) { btn.disabled = true; btn.textContent = 'Refreshing...'; }

        try {
            const data = await _silentRefresh();

            // Update expiry with new token info
            if (data?.expiresAt) {
                _expiresAt = new Date(data.expiresAt).getTime();
                _scheduleWarning();
            } else {
                // Default: assume 15 min extension
                _expiresAt = Date.now() + 15 * 60 * 1000;
                _scheduleWarning();
            }

            _hideModal();
            bdToast.success('Session extended successfully.');

        } catch (err) {
            _forceLogout();
        }
    }

    async function _silentRefresh() {
        // Call the refresh endpoint (refresh token is in HttpOnly cookie)
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Refresh failed');
        return response.json();
    }

    function _forceLogout() {
        _hideModal();
        clearInterval(_checkTimer);
        clearTimeout(_warningTimer);
        // Redirect to login
        window.location.href = '/account/login?reason=session_expired';
    }

    // ─────────────────────────────────────────────────────────
    //  BIND UI BUTTONS
    // ─────────────────────────────────────────────────────────
    function _bindUI() {
        document.addEventListener('DOMContentLoaded', () => {
            const continueBtn = document.getElementById('bdSessionContinue');
            const logoutBtn   = document.getElementById('bdSessionLogout');

            if (continueBtn) continueBtn.addEventListener('click', _handleContinue);
            if (logoutBtn)   logoutBtn.addEventListener('click', _forceLogout);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  UPDATE EXPIRY  (call this when tokens are refreshed elsewhere)
    // ─────────────────────────────────────────────────────────
    function updateExpiry(newExpiresAt) {
        _expiresAt = typeof newExpiresAt === 'number'
            ? newExpiresAt
            : new Date(newExpiresAt).getTime();
        _hideModal();
        _scheduleWarning();
    }

    // Auto-init
    document.addEventListener('DOMContentLoaded', init);

    return { init, updateExpiry };

})();
