/**
 * event-bus.js - Pub/Sub event system
 *
 * Provides a simple publish-subscribe event system for
 * communication between modules without tight coupling.
 */

'use strict';

window.bdEvents = (function () {

    // Storage for event subscribers
    const _subscribers = {};

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event to subscribe to
     * @param {Function} callback - Function to call when event is published
     */
    function subscribe(eventName, callback) {
        if (!eventName || typeof callback !== 'function') {
            console.warn('[bdEvents] Invalid subscribe call:', eventName, callback);
            return;
        }

        if (!_subscribers[eventName]) {
            _subscribers[eventName] = [];
        }

        _subscribers[eventName].push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event to unsubscribe from
     * @param {Function} callback - The callback function to remove
     */
    function unsubscribe(eventName, callback) {
        if (!eventName || !_subscribers[eventName]) {
            return;
        }

        if (!callback) {
            // Remove all subscribers for this event
            delete _subscribers[eventName];
            return;
        }

        // Remove specific callback
        _subscribers[eventName] = _subscribers[eventName].filter(function (cb) {
            return cb !== callback;
        });

        // Clean up if no more subscribers
        if (_subscribers[eventName].length === 0) {
            delete _subscribers[eventName];
        }
    }

    /**
     * Publish an event to all subscribers
     * @param {string} eventName - Name of the event to publish
     * @param {*} data - Data to pass to subscribers
     */
    function publish(eventName, data) {
        if (!eventName || !_subscribers[eventName]) {
            return;
        }

        _subscribers[eventName].forEach(function (callback) {
            try {
                callback(data);
            } catch (error) {
                console.error('[bdEvents] Error in subscriber for event "' + eventName + '":', error);
            }
        });
    }

    /**
     * Get the count of subscribers for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of subscribers
     */
    function getSubscriberCount(eventName) {
        return _subscribers[eventName] ? _subscribers[eventName].length : 0;
    }

    /**
     * Clear all subscribers for all events
     */
    function clearAll() {
        for (const eventName in _subscribers) {
            delete _subscribers[eventName];
        }
    }

    // Public API
    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        publish: publish,
        getSubscriberCount: getSubscriberCount,
        clearAll: clearAll
    };

})();
