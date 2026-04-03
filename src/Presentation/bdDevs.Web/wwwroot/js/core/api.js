/**
 * api.js - jQuery $.ajax based API service
 *
 * Provides a centralized API service for making HTTP requests
 * using jQuery's $.ajax. Includes error handling, loading indicators,
 * and integration with Kendo DataSource.
 */

'use strict';

window.bdApi = (function () {

    /**
     * Get the anti-forgery token from the page
     * @returns {string|null} The anti-forgery token value
     */
    function getAntiForgeryToken() {
        const token = $('input[name="__RequestVerificationToken"]').val();
        return token || null;
    }

    /**
     * Handle API errors based on status code
     * @param {number} status - HTTP status code
     * @param {object} response - Response data
     */
    function handleError(status, response) {
        switch (status) {
            case 401:
                // Unauthorized - redirect to login
                window.location.href = '/Account/Login?returnUrl=' + encodeURIComponent(window.location.pathname);
                break;
            case 403:
                // Forbidden - access denied
                if (window.bdNotify) {
                    window.bdNotify.error('Access denied. You do not have permission to perform this action.');
                }
                break;
            case 404:
                // Not found
                if (window.bdNotify) {
                    window.bdNotify.error('Resource not found.');
                }
                break;
            case 500:
                // Server error
                if (window.bdNotify) {
                    const message = response && response.message ? response.message : 'An unexpected server error occurred.';
                    window.bdNotify.error(message);
                }
                break;
            default:
                if (window.bdNotify) {
                    const message = response && response.message ? response.message : 'An error occurred while processing your request.';
                    window.bdNotify.error(message);
                }
        }
    }

    /**
     * Make a GET request
     * @param {string} url - The URL to request
     * @param {object} params - Query parameters
     * @returns {Promise} jQuery promise
     */
    function get(url, params) {
        if (window.bdLoading && window.bdLoading.page) {
            window.bdLoading.page.start();
        }

        return $.ajax({
            url: url,
            type: 'GET',
            data: params,
            dataType: 'json',
            cache: false
        }).done(function (response) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
        }).fail(function (xhr) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
            const response = xhr.responseJSON;
            handleError(xhr.status, response);
        });
    }

    /**
     * Make a POST request
     * @param {string} url - The URL to request
     * @param {object} data - Data to send
     * @returns {Promise} jQuery promise
     */
    function post(url, data) {
        if (window.bdLoading && window.bdLoading.page) {
            window.bdLoading.page.start();
        }

        const headers = {};
        const token = getAntiForgeryToken();
        if (token) {
            headers['RequestVerificationToken'] = token;
        }

        return $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            headers: headers
        }).done(function (response) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
        }).fail(function (xhr) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
            const response = xhr.responseJSON;
            handleError(xhr.status, response);
        });
    }

    /**
     * Make a PUT request
     * @param {string} url - The URL to request
     * @param {object} data - Data to send
     * @returns {Promise} jQuery promise
     */
    function put(url, data) {
        if (window.bdLoading && window.bdLoading.page) {
            window.bdLoading.page.start();
        }

        const headers = {};
        const token = getAntiForgeryToken();
        if (token) {
            headers['RequestVerificationToken'] = token;
        }

        return $.ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            headers: headers
        }).done(function (response) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
        }).fail(function (xhr) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
            const response = xhr.responseJSON;
            handleError(xhr.status, response);
        });
    }

    /**
     * Make a DELETE request
     * @param {string} url - The URL to request
     * @returns {Promise} jQuery promise
     */
    function deleteRequest(url) {
        if (window.bdLoading && window.bdLoading.page) {
            window.bdLoading.page.start();
        }

        const headers = {};
        const token = getAntiForgeryToken();
        if (token) {
            headers['RequestVerificationToken'] = token;
        }

        return $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json',
            headers: headers
        }).done(function (response) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
        }).fail(function (xhr) {
            if (window.bdLoading && window.bdLoading.page) {
                window.bdLoading.page.done();
            }
            const response = xhr.responseJSON;
            handleError(xhr.status, response);
        });
    }

    /**
     * Create a Kendo DataSource read transport function
     * @param {string} url - The URL to request
     * @returns {Function} Transport function for Kendo DataSource
     */
    function kendoRead(url) {
        return function (options) {
            $.ajax({
                url: url,
                type: 'GET',
                data: options.data,
                dataType: 'json',
                cache: false
            }).done(function (response) {
                options.success(response);
            }).fail(function (xhr) {
                const response = xhr.responseJSON;
                handleError(xhr.status, response);
                options.error(xhr);
            });
        };
    }

    // Public API
    return {
        get: get,
        post: post,
        put: put,
        delete: deleteRequest,
        kendoRead: kendoRead
    };

})();
