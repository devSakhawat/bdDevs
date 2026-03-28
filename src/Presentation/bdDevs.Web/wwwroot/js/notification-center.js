/**
 * notification-center.js — Notification Center
 * Step 7.6 — Interaction Components
 *
 * Features:
 *   • Bell icon drawer with unread badge
 *   • Initial fetch from GET /api/notifications
 *   • SignalR real-time push (NotificationHub)
 *   • Mark as read / Mark all as read
 *   • Filter by tab (all / unread / info / warning)
 *   • Click → navigate to related page
 */

'use strict';

window.bdNotificationCenter = (function () {

    const HUB_URL = () => (window.bdConfig?.hubUrl || '/hubs/notification');
    const API_URL = '/notifications';

    let _notifications = [];
    let _filter        = 'all';
    let _hub           = null;
    let _isOpen        = false;

    // ─────────────────────────────────────────────────────────
    //  INIT
    // ─────────────────────────────────────────────────────────
    function init() {
        _bindUI();
        _fetchInitial();
        _connectSignalR();
    }

    // ─────────────────────────────────────────────────────────
    //  UI BINDING
    // ─────────────────────────────────────────────────────────
    function _bindUI() {
        // Toggle panel from bell button or event bus
        bdEvents.on('notification:toggle', _toggle);

        // Close button
        const closeBtn = document.getElementById('bdNotifClose');
        if (closeBtn) closeBtn.addEventListener('click', _close);

        // Backdrop
        const backdrop = document.getElementById('bdNotifBackdrop');
        if (backdrop) backdrop.addEventListener('click', _close);

        // Mark all read
        const markAll = document.getElementById('bdMarkAllRead');
        if (markAll) markAll.addEventListener('click', _markAllRead);

        // Filter tabs
        document.querySelectorAll('.bd-notif-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                _filter = tab.dataset.filter;
                document.querySelectorAll('.bd-notif-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                _renderList();
            });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  PANEL OPEN / CLOSE
    // ─────────────────────────────────────────────────────────
    function _toggle() { _isOpen ? _close() : _open(); }

    function _open() {
        const panel   = document.getElementById('bdNotificationPanel');
        const backdrop = document.getElementById('bdNotifBackdrop');
        const bellBtn  = document.getElementById('bdNotificationBtn');

        if (panel) panel.style.display = 'flex';
        if (backdrop) backdrop.style.display = 'block';
        if (bellBtn) bellBtn.setAttribute('aria-expanded', 'true');

        _isOpen = true;
    }

    function _close() {
        const panel   = document.getElementById('bdNotificationPanel');
        const backdrop = document.getElementById('bdNotifBackdrop');
        const bellBtn  = document.getElementById('bdNotificationBtn');

        if (panel) panel.style.display = 'none';
        if (backdrop) backdrop.style.display = 'none';
        if (bellBtn) bellBtn.setAttribute('aria-expanded', 'false');

        _isOpen = false;
    }

    // ─────────────────────────────────────────────────────────
    //  FETCH
    // ─────────────────────────────────────────────────────────
    async function _fetchInitial() {
        try {
            const data = await bdApi.get(API_URL, { page: 1, pageSize: 30 });
            _notifications = data?.items || data?.data || [];
            _renderList();
            _updateBadge();
        } catch (err) {
            // Fail gracefully — show empty state
            _showEmptyState();
        } finally {
            _hideLoading();
        }
    }

    // ─────────────────────────────────────────────────────────
    //  SIGNALR
    // ─────────────────────────────────────────────────────────
    function _connectSignalR() {
        if (typeof signalR === 'undefined') return;

        _hub = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL())
            .withAutomaticReconnect()
            .build();

        // Receive notification
        _hub.on('ReceiveNotification', function (notification) {
            _notifications.unshift(notification);
            _renderList();
            _updateBadge();

            // Also show a toast for high-priority items
            if (notification.type === 'warning' || notification.type === 'error') {
                bdToast[notification.type || 'info'](
                    notification.message,
                    {
                        title: notification.title,
                        action: notification.actionUrl
                            ? { label: 'View', fn: () => window.location.href = notification.actionUrl }
                            : undefined
                    }
                );
            }
        });

        _hub.start().catch(err => {
            console.warn('[bdNotificationCenter] SignalR connection failed:', err);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────
    function _renderList() {
        const container = document.getElementById('bdNotifItems');
        if (!container) return;

        const filtered = _getFiltered();

        _hideLoading();

        if (!filtered.length) {
            _showEmptyState();
            container.innerHTML = '';
            return;
        }

        _hideEmptyState();

        // Group by date
        const grouped = _groupByDate(filtered);

        container.innerHTML = Object.entries(grouped)
            .map(([dateLabel, items]) => `
                <div class="bd-notif-date-group">
                    <div class="bd-notif-date-label">${dateLabel}</div>
                    ${items.map(_renderItem).join('')}
                </div>
            `)
            .join('');

        // Bind click handlers
        container.querySelectorAll('.bd-notif-item').forEach(el => {
            el.addEventListener('click', () => {
                const id  = el.dataset.id;
                const url = el.dataset.actionUrl;
                _markRead(id);
                if (url) window.location.href = url;
            });
        });
    }

    function _renderItem(n) {
        const icons = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' };
        const icon  = icons[n.type] || 'ℹ';

        return `
            <div class="bd-notif-item ${n.isRead ? '' : 'unread'}"
                 data-id="${n.id}"
                 data-action-url="${n.actionUrl || ''}">
                <div class="bd-notif-item-dot"></div>
                <div class="bd-notif-item-body">
                    <div class="bd-notif-item-title">${_esc(n.title)}</div>
                    <div class="bd-notif-item-msg">${_esc(n.message)}</div>
                    <div class="bd-notif-item-time">${_formatTime(n.createdAt)}</div>
                </div>
                <div class="bd-notif-type-icon bd-notif-type--${n.type || 'info'}">${icon}</div>
            </div>
        `;
    }

    // ─────────────────────────────────────────────────────────
    //  MARK READ
    // ─────────────────────────────────────────────────────────
    async function _markRead(id) {
        const n = _notifications.find(n => n.id === id);
        if (n && !n.isRead) {
            n.isRead = true;
            _updateBadge();
            _renderList();
            try {
                await bdApi.put(`${API_URL}/${id}/read`, {});
            } catch (_) {}
        }
    }

    async function _markAllRead() {
        _notifications.forEach(n => n.isRead = true);
        _updateBadge();
        _renderList();
        try {
            await bdApi.put(`${API_URL}/read-all`, {});
        } catch (_) {}
    }

    // ─────────────────────────────────────────────────────────
    //  BADGE
    // ─────────────────────────────────────────────────────────
    function _updateBadge() {
        const count  = _notifications.filter(n => !n.isRead).length;
        const badge  = document.getElementById('bdNotificationBadge');
        const countEl = document.getElementById('bdNotifCount');

        if (badge) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        if (countEl) {
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // ─────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────
    function _getFiltered() {
        switch (_filter) {
            case 'unread':  return _notifications.filter(n => !n.isRead);
            case 'info':    return _notifications.filter(n => n.type === 'info');
            case 'warning': return _notifications.filter(n => n.type === 'warning' || n.type === 'error');
            default:        return _notifications;
        }
    }

    function _groupByDate(items) {
        const today     = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const groups = {};
        items.forEach(item => {
            const d = new Date(item.createdAt);
            let label;
            if (_sameDay(d, today))     label = 'Today';
            else if (_sameDay(d, yesterday)) label = 'Yesterday';
            else label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            (groups[label] || (groups[label] = [])).push(item);
        });
        return groups;
    }

    function _sameDay(a, b) {
        return a.getFullYear() === b.getFullYear()
            && a.getMonth()    === b.getMonth()
            && a.getDate()     === b.getDate();
    }

    function _formatTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = Date.now();
        const diff = now - d.getTime();
        if (diff < 60000)     return 'Just now';
        if (diff < 3600000)   return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000)  return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    }

    function _esc(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function _hideLoading() {
        const el = document.getElementById('bdNotifLoading');
        if (el) el.style.display = 'none';
    }

    function _showEmptyState() {
        const el = document.getElementById('bdNotifEmpty');
        if (el) el.style.display = 'flex';
    }

    function _hideEmptyState() {
        const el = document.getElementById('bdNotifEmpty');
        if (el) el.style.display = 'none';
    }

    // ─────────────────────────────────────────────────────────
    //  AUTO INIT
    // ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

    return { init, open: _open, close: _close };

})();
