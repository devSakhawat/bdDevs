/**
 * permissions.js - Role-based UI permission manager
 *
 * Manages user permissions for UI elements. Handles permission checking,
 * caching, and automatic application to DOM elements with data-permission attributes.
 */

'use strict';

window.bdPermissions = (function () {

    const STORAGE_KEY = 'bd_user_permissions';
    let _permissions = {};
    let _initialized = false;

    /**
     * Initialize permissions from server data
     * @param {object} permissions - Permission object from server (format: { "Module:Action": true })
     */
    function init(permissions) {
        if (!permissions || typeof permissions !== 'object') {
            console.warn('[bdPermissions] Invalid permissions data');
            return;
        }

        _permissions = permissions;
        _initialized = true;

        // Cache in sessionStorage
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_permissions));
        } catch (e) {
            console.warn('[bdPermissions] Failed to cache permissions:', e);
        }

        // Apply to existing elements
        applyToElements();
    }

    /**
     * Load permissions from cache
     * @returns {boolean} True if successfully loaded from cache
     */
    function loadFromCache() {
        try {
            const cached = sessionStorage.getItem(STORAGE_KEY);
            if (cached) {
                _permissions = JSON.parse(cached);
                _initialized = true;
                return true;
            }
        } catch (e) {
            console.warn('[bdPermissions] Failed to load cached permissions:', e);
        }
        return false;
    }

    /**
     * Check if user has a specific permission
     * @param {string} module - Module name (e.g., "Employee", "Lead")
     * @param {string} action - Action name (e.g., "View", "Create", "Edit", "Delete")
     * @returns {boolean} True if user has permission
     */
    function can(module, action) {
        if (!_initialized) {
            loadFromCache();
        }

        if (!module || !action) {
            return false;
        }

        const key = module + ':' + action;
        return _permissions[key] === true;
    }

    /**
     * Check if user has any of the specified permissions
     * @param {Array<string>} permissionKeys - Array of permission keys (e.g., ["Employee:Edit", "Employee:Delete"])
     * @returns {boolean} True if user has at least one permission
     */
    function canAny(permissionKeys) {
        if (!Array.isArray(permissionKeys)) {
            return false;
        }

        return permissionKeys.some(function (key) {
            return _permissions[key] === true;
        });
    }

    /**
     * Check if user has all of the specified permissions
     * @param {Array<string>} permissionKeys - Array of permission keys
     * @returns {boolean} True if user has all permissions
     */
    function canAll(permissionKeys) {
        if (!Array.isArray(permissionKeys)) {
            return false;
        }

        return permissionKeys.every(function (key) {
            return _permissions[key] === true;
        });
    }

    /**
     * Apply permissions to DOM elements with data-permission attribute
     * Elements without permission will be hidden or disabled
     */
    function applyToElements() {
        if (!_initialized) {
            return;
        }

        $('[data-permission]').each(function () {
            const element = $(this);
            const permission = element.attr('data-permission');
            const action = element.attr('data-permission-action') || 'hide'; // hide or disable

            if (!permission) {
                return;
            }

            // Check if permission key contains ':'
            let hasPermission = false;
            if (permission.indexOf(':') > -1) {
                hasPermission = _permissions[permission] === true;
            } else {
                // Legacy format: assume it's just the action, extract module from context
                console.warn('[bdPermissions] Permission should be in format "Module:Action":', permission);
                return;
            }

            if (!hasPermission) {
                if (action === 'disable') {
                    element.prop('disabled', true).addClass('disabled');
                } else {
                    element.hide();
                }
            } else {
                if (action === 'disable') {
                    element.prop('disabled', false).removeClass('disabled');
                } else {
                    element.show();
                }
            }
        });
    }

    /**
     * Get all permissions
     * @returns {object} All permissions
     */
    function getAll() {
        if (!_initialized) {
            loadFromCache();
        }
        return Object.assign({}, _permissions);
    }

    /**
     * Clear permissions cache
     */
    function clearCache() {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.warn('[bdPermissions] Failed to clear cache:', e);
        }
        _permissions = {};
        _initialized = false;
    }

    // Public API
    return {
        init: init,
        can: can,
        canAny: canAny,
        canAll: canAll,
        applyToElements: applyToElements,
        getAll: getAll,
        clearCache: clearCache
    };

})();
