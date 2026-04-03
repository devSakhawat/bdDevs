/**
 * grid-base.js - Reusable Kendo Grid configuration utilities
 *
 * Provides utility functions for common Kendo Grid operations:
 * - DataSource creation with standard configuration
 * - Row highlighting based on status
 * - State persistence (save/restore)
 * - Default toolbar and pager configurations
 */

'use strict';

window.bdGridBase = (function () {

    const STATE_STORAGE_PREFIX = 'bd_grid_state_';

    /**
     * Create a Kendo DataSource with common configuration
     * @param {object} options - Configuration options
     * @param {string} options.url - API endpoint URL
     * @param {string} options.dataField - Path to data array in response (default: 'data')
     * @param {string} options.totalField - Path to total count in response (default: 'total')
     * @param {number} options.pageSize - Page size (default: 20)
     * @param {object} options.schema - Additional schema configuration
     * @returns {kendo.data.DataSource} Configured DataSource
     */
    function createDataSource(options) {
        options = options || {};

        const dataSourceConfig = {
            transport: {
                read: {
                    url: options.url,
                    type: 'GET',
                    dataType: 'json'
                },
                parameterMap: function (data, type) {
                    if (type === 'read') {
                        return {
                            page: data.page || 1,
                            pageSize: data.pageSize || 20,
                            sort: data.sort ? JSON.stringify(data.sort) : null,
                            filter: data.filter ? JSON.stringify(data.filter) : null
                        };
                    }
                    return data;
                }
            },
            schema: {
                data: options.dataField || 'data',
                total: options.totalField || 'total',
                model: options.model || {}
            },
            pageSize: options.pageSize || 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
        };

        // Merge additional schema configuration
        if (options.schema) {
            $.extend(true, dataSourceConfig.schema, options.schema);
        }

        // Add custom transport functions if provided
        if (options.create) {
            dataSourceConfig.transport.create = options.create;
        }
        if (options.update) {
            dataSourceConfig.transport.update = options.update;
        }
        if (options.destroy) {
            dataSourceConfig.transport.destroy = options.destroy;
        }

        return new kendo.data.DataSource(dataSourceConfig);
    }

    /**
     * Apply row highlighting based on status field
     * @param {kendo.ui.Grid} grid - The Kendo Grid instance
     * @param {string} statusField - Name of the status field (default: 'status')
     * @param {object} statusColors - Status to CSS class mapping
     */
    function applyRowHighlight(grid, statusField, statusColors) {
        if (!grid) {
            return;
        }

        statusField = statusField || 'status';
        statusColors = statusColors || {
            'Active': 'bd-row-success',
            'Inactive': 'bd-row-muted',
            'Pending': 'bd-row-warning',
            'Deleted': 'bd-row-danger',
            'Draft': 'bd-row-info'
        };

        grid.tbody.find('tr').each(function () {
            const row = $(this);
            const dataItem = grid.dataItem(row);

            if (dataItem && dataItem[statusField]) {
                const status = dataItem[statusField];
                const cssClass = statusColors[status];
                if (cssClass) {
                    row.addClass(cssClass);
                }
            }
        });
    }

    /**
     * Save grid state to localStorage
     * @param {string} key - Storage key for this grid
     * @param {kendo.ui.Grid} grid - The Kendo Grid instance
     */
    function saveState(key, grid) {
        if (!key || !grid) {
            return;
        }

        try {
            const state = {
                page: grid.dataSource.page(),
                pageSize: grid.dataSource.pageSize(),
                sort: grid.dataSource.sort(),
                filter: grid.dataSource.filter(),
                columns: []
            };

            // Save column visibility and order
            grid.columns.forEach(function (column) {
                if (column.field) {
                    state.columns.push({
                        field: column.field,
                        hidden: column.hidden || false,
                        width: column.width
                    });
                }
            });

            localStorage.setItem(STATE_STORAGE_PREFIX + key, JSON.stringify(state));
        } catch (e) {
            console.warn('[bdGridBase] Failed to save grid state:', e);
        }
    }

    /**
     * Restore grid state from localStorage
     * @param {string} key - Storage key for this grid
     * @param {kendo.ui.Grid} grid - The Kendo Grid instance
     */
    function restoreState(key, grid) {
        if (!key || !grid) {
            return false;
        }

        try {
            const stateJson = localStorage.getItem(STATE_STORAGE_PREFIX + key);
            if (!stateJson) {
                return false;
            }

            const state = JSON.parse(stateJson);

            // Restore filter and sort
            if (state.filter) {
                grid.dataSource.filter(state.filter);
            }
            if (state.sort) {
                grid.dataSource.sort(state.sort);
            }

            // Restore page size
            if (state.pageSize) {
                grid.dataSource.pageSize(state.pageSize);
            }

            // Restore column visibility and width
            if (state.columns && state.columns.length > 0) {
                state.columns.forEach(function (columnState) {
                    const column = grid.columns.find(function (col) {
                        return col.field === columnState.field;
                    });
                    if (column) {
                        if (columnState.hidden) {
                            grid.hideColumn(column);
                        } else {
                            grid.showColumn(column);
                        }
                    }
                });
            }

            // Restore page (must be last)
            if (state.page) {
                grid.dataSource.page(state.page);
            }

            return true;
        } catch (e) {
            console.warn('[bdGridBase] Failed to restore grid state:', e);
            return false;
        }
    }

    /**
     * Clear saved grid state
     * @param {string} key - Storage key for this grid
     */
    function clearState(key) {
        if (!key) {
            return;
        }

        try {
            localStorage.removeItem(STATE_STORAGE_PREFIX + key);
        } catch (e) {
            console.warn('[bdGridBase] Failed to clear grid state:', e);
        }
    }

    /**
     * Get default toolbar configuration
     * @returns {Array} Toolbar configuration
     */
    function getDefaultToolbar() {
        return [
            { name: 'create', text: 'Add New' },
            { name: 'excel', text: 'Export to Excel' },
            { name: 'pdf', text: 'Export to PDF' },
            { template: '<button type="button" class="k-button k-button-icontext k-grid-refresh"><span class="k-icon k-i-reload"></span>Refresh</button>' }
        ];
    }

    /**
     * Get default pageable configuration
     * @param {number} pageSize - Default page size
     * @returns {object} Pageable configuration
     */
    function getDefaultPageable(pageSize) {
        return {
            refresh: true,
            pageSizes: [10, 20, 50, 100],
            pageSize: pageSize || 20,
            buttonCount: 5,
            input: true,
            info: true,
            messages: {
                display: 'Showing {0}-{1} of {2} items',
                empty: 'No items to display',
                page: 'Page',
                of: 'of {0}',
                itemsPerPage: 'items per page',
                first: 'Go to the first page',
                previous: 'Go to the previous page',
                next: 'Go to the next page',
                last: 'Go to the last page',
                refresh: 'Refresh'
            }
        };
    }

    // Public API
    return {
        createDataSource: createDataSource,
        applyRowHighlight: applyRowHighlight,
        saveState: saveState,
        restoreState: restoreState,
        clearState: clearState,
        getDefaultToolbar: getDefaultToolbar,
        getDefaultPageable: getDefaultPageable
    };

})();
