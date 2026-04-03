/**
 * notify.js - Kendo Notification based toast
 *
 * Provides toast notification functionality using Kendo UI Notification.
 * Supports success, error, warning, and info message types.
 */

'use strict';

window.bdNotify = (function () {

    let _notification = null;

    /**
     * Initialize the notification widget
     */
    function init() {
        if (_notification) {
            return;
        }

        // Create a container for notifications if it doesn't exist
        let container = $('#bdNotificationContainer');
        if (container.length === 0) {
            container = $('<div id="bdNotificationContainer"></div>').appendTo('body');
        }

        _notification = container.kendoNotification({
            position: {
                pinned: true,
                top: 20,
                right: 20
            },
            autoHideAfter: 5000,
            stacking: 'down',
            templates: [
                {
                    type: 'success',
                    template: '<div class="bd-notification bd-notification-success">' +
                              '<span class="bd-notification-icon">✓</span>' +
                              '<span class="bd-notification-message">#= message #</span>' +
                              '</div>'
                },
                {
                    type: 'error',
                    template: '<div class="bd-notification bd-notification-error">' +
                              '<span class="bd-notification-icon">✕</span>' +
                              '<span class="bd-notification-message">#= message #</span>' +
                              '</div>'
                },
                {
                    type: 'warning',
                    template: '<div class="bd-notification bd-notification-warning">' +
                              '<span class="bd-notification-icon">⚠</span>' +
                              '<span class="bd-notification-message">#= message #</span>' +
                              '</div>'
                },
                {
                    type: 'info',
                    template: '<div class="bd-notification bd-notification-info">' +
                              '<span class="bd-notification-icon">ℹ</span>' +
                              '<span class="bd-notification-message">#= message #</span>' +
                              '</div>'
                }
            ]
        }).data('kendoNotification');
    }

    /**
     * Show a success notification
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    function success(message, duration) {
        init();
        if (duration) {
            _notification.setOptions({ autoHideAfter: duration });
        }
        _notification.show({ message: message }, 'success');
        if (duration) {
            _notification.setOptions({ autoHideAfter: 5000 }); // Reset to default
        }
    }

    /**
     * Show an error notification
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    function error(message, duration) {
        init();
        if (duration) {
            _notification.setOptions({ autoHideAfter: duration });
        }
        _notification.show({ message: message }, 'error');
        if (duration) {
            _notification.setOptions({ autoHideAfter: 5000 }); // Reset to default
        }
    }

    /**
     * Show a warning notification
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    function warning(message, duration) {
        init();
        if (duration) {
            _notification.setOptions({ autoHideAfter: duration });
        }
        _notification.show({ message: message }, 'warning');
        if (duration) {
            _notification.setOptions({ autoHideAfter: 5000 }); // Reset to default
        }
    }

    /**
     * Show an info notification
     * @param {string} message - The message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    function info(message, duration) {
        init();
        if (duration) {
            _notification.setOptions({ autoHideAfter: duration });
        }
        _notification.show({ message: message }, 'info');
        if (duration) {
            _notification.setOptions({ autoHideAfter: 5000 }); // Reset to default
        }
    }

    /**
     * Hide all notifications
     */
    function hideAll() {
        if (_notification) {
            _notification.hide();
        }
    }

    // Public API
    return {
        success: success,
        error: error,
        warning: warning,
        info: info,
        hideAll: hideAll
    };

})();
