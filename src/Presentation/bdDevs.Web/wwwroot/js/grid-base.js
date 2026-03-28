/**
 * grid-base.js — Enterprise Grid Standard
 * Step 7.7 / Phase 1B prep
 *
 * Provides a factory for all Kendo Grids across the app:
 *   • Server-side pagination, filtering, sorting (always on)
 *   • Standard toolbar (search, filter, column chooser, export, refresh, new)
 *   • Bulk action support
 *   • Row context menu (right-click)
 *   • Consistent density from theme
 *   • Export to Excel / PDF / CSV
 *
 * Usage:
 *   const grid = bdGrid.create('#leadGrid', {
 *       dataUrl:   '/api/leads',
 *       columns:   [...],
 *       pageSize:  20,
 *       onNew:     () => bdModal.open({ url: '/crm/leads/create', title: 'New Lead', width: 'lg' }),
 *       onEdit:    (id) => bdModal.open({ url: `/crm/leads/${id}/edit`, title: 'Edit Lead', width: 'lg' }),
 *       onDelete:  (id) => _deleteLead(id),
 *       contextMenuItems: [
 *           { text: 'View Detail', icon: '👁', action: (row) => _openDetail(row.id) },
 *           { text: 'Clone',       icon: '📋', action: (row) => _clone(row.id) },
 *       ],
 *   });
 *
 *   grid.refresh();
 *   grid.getSelected();   // → array of selected row data
 */

'use strict';

window.bdGrid = (function () {

    const PAGE_SIZE_OPTIONS = [20, 50, 100];

    // ─────────────────────────────────────────────────────────
    //  CREATE
    // ─────────────────────────────────────────────────────────
    function create(selector, opts = {}) {
        const el = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;

        if (!el) { console.warn('[bdGrid] Element not found:', selector); return null; }

        const pageSize = opts.pageSize || 20;

        // ── DATA SOURCE ──────────────────────────────────────
        const dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url:         opts.dataUrl,
                    dataType:   'json',
                    type:       'POST',
                    contentType:'application/json',
                    data:       opts.extraParams || {},
                },
                parameterMap: function (data, operation) {
                    if (operation === 'read') {
                        // Map Kendo params to GridRequestParams shape
                        return JSON.stringify({
                            page:     data.page,
                            pageSize: data.pageSize,
                            skip:     data.skip,
                            take:     data.take,
                            sort:     data.sort,
                            filter:   data.filter,
                            search:   el._bdSearchQuery || '',
                            ...(opts.extraParams || {}),
                        });
                    }
                },
            },
            schema: {
                data:  opts.schemaData  || 'items',
                total: opts.schemaTotal || 'totalCount',
                model: opts.model || { id: 'id' },
            },
            serverPaging:   true,
            serverSorting:  true,
            serverFiltering:true,
            pageSize:        pageSize,
            error: function (e) {
                bdToast.error('Failed to load data. Please try again.', { title: 'Grid Error' });
                console.error('[bdGrid] DataSource error:', e);
            }
        });

        // ── COLUMNS ──────────────────────────────────────────
        const columns = [
            // Checkbox column for bulk select
            {
                selectable: true,
                width: '42px',
                headerAttributes: { class: 'bd-grid-checkbox-header' },
                attributes:       { class: 'bd-grid-checkbox-cell' },
            },
            ...(opts.columns || []),
            // Actions column
            {
                title:   '',
                width:   '80px',
                sortable: false,
                filterable: false,
                attributes: { class: 'bd-grid-actions-cell' },
                template: function (dataItem) {
                    return `
                        <div class="bd-grid-row-actions">
                            <button class="bd-row-btn bd-row-btn-edit"
                                    title="Edit"
                                    data-id="${dataItem.id}">
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 5l4 4-8 8H3v-4L11 5zM14 3l3 3"/>
                                </svg>
                            </button>
                            <button class="bd-row-btn bd-row-btn-delete"
                                    title="Delete"
                                    data-id="${dataItem.id}">
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 17 6"/>
                                    <path d="M8 6V4h4v2M19 6l-1 12a2 2 0 01-2 2H4a2 2 0 01-2-2L1 6"/>
                                </svg>
                            </button>
                        </div>
                    `;
                }
            }
        ];

        // ── KENDO GRID ───────────────────────────────────────
        const $el = $(el);

        $el.kendoGrid({
            dataSource:    dataSource,
            columns:       columns,
            pageable: {
                refresh:     true,
                pageSizes:   PAGE_SIZE_OPTIONS,
                buttonCount: 5,
                messages:    { itemsPerPage: '/ page', display: '{0}-{1} of {2} records' }
            },
            sortable:  { mode: 'single', allowUnsort: true },
            filterable: opts.filterable !== false,
            resizable:  true,
            reorderable: true,
            columnMenu: true,
            scrollable: true,
            selectable: 'multiple row',
            persistSelection: false,
            rowTemplate: opts.rowTemplate,

            // Density-aware row height
            height: opts.height || 'auto',

            dataBound: function () {
                _bindRowActions(this, opts);
                _updateBulkBar(this);
            },

            change: function () {
                _updateBulkBar(this);
            },
        });

        const grid = $el.data('kendoGrid');

        // ── CONTEXT MENU ─────────────────────────────────────
        if (opts.contextMenuItems?.length) {
            _initContextMenu(el, grid, opts.contextMenuItems);
        }

        // ── SEARCH ───────────────────────────────────────────
        const searchInput = el.closest('.bd-grid-page')?.querySelector('#bdGridSearch');
        if (searchInput) {
            let _debounce;
            searchInput.addEventListener('input', function () {
                clearTimeout(_debounce);
                _debounce = setTimeout(() => {
                    el._bdSearchQuery = this.value;
                    dataSource.page(1);
                    dataSource.read();
                }, 400);
            });
        }

        // ── REFRESH BUTTON ───────────────────────────────────
        const refreshBtn = el.closest('.bd-grid-page')?.querySelector('#bdRefreshGrid');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.style.transform = 'rotate(360deg)';
                refreshBtn.style.transition = 'transform 0.5s ease';
                setTimeout(() => { refreshBtn.style.transform = ''; refreshBtn.style.transition = ''; }, 500);
                dataSource.read();
            });
        }

        // ── EXPORT BUTTONS ───────────────────────────────────
        const exportBtn  = el.closest('.bd-grid-page')?.querySelector('#bdExportBtn');
        const exportMenu = el.closest('.bd-grid-page')?.querySelector('#bdExportMenu');
        if (exportBtn && exportMenu) {
            exportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                exportMenu.style.display = exportMenu.style.display === 'none' ? 'block' : 'none';
            });
            document.addEventListener('click', () => { exportMenu.style.display = 'none'; });

            exportMenu.querySelectorAll('.bd-export-item').forEach(item => {
                item.addEventListener('click', () => {
                    exportMenu.style.display = 'none';
                    _handleExport(grid, item.dataset.format, opts);
                });
            });
        }

        // ── NEW BUTTON ───────────────────────────────────────
        if (opts.onNew) {
            bdEvents.on('page:new', opts.onNew);
            document.addEventListener('keydown', function (e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'n'
                    && !e.target.matches('input,textarea,select')) {
                    e.preventDefault();
                    opts.onNew();
                }
            });
        }

        // ─────────────────────────────────────────────────────
        //  PUBLIC GRID INSTANCE
        // ─────────────────────────────────────────────────────
        return {
            kendo:      grid,
            dataSource: dataSource,
            refresh:    () => dataSource.read(),
            getSelected: () => grid.selectedKeyNames().map(k =>
                dataSource.data().find(d => String(d.id) === String(k))
            ).filter(Boolean),
            setExtraParams: (params) => {
                Object.assign(opts.extraParams || (opts.extraParams = {}), params);
                dataSource.read();
            },
        };
    }

    // ─────────────────────────────────────────────────────────
    //  ROW ACTION BUTTONS
    // ─────────────────────────────────────────────────────────
    function _bindRowActions(grid, opts) {
        const tbody = grid.tbody;

        tbody.find('.bd-row-btn-edit').on('click', function (e) {
            e.stopPropagation();
            const id = $(this).data('id');
            if (opts.onEdit) opts.onEdit(id);
        });

        tbody.find('.bd-row-btn-delete').on('click', function (e) {
            e.stopPropagation();
            const id = $(this).data('id');
            bdModal.confirm({
                title:        'Delete Record',
                message:      'Are you sure you want to delete this record? This action cannot be undone.',
                confirmLabel: 'Delete',
                onConfirm:    () => opts.onDelete && opts.onDelete(id),
            });
        });

        // Double-click → edit
        tbody.find('tr[data-uid]').on('dblclick', function () {
            const dataItem = grid.dataItem($(this));
            if (dataItem && opts.onEdit) opts.onEdit(dataItem.id);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  BULK ACTION BAR
    // ─────────────────────────────────────────────────────────
    function _updateBulkBar(grid) {
        const page         = grid.element[0]?.closest('.bd-grid-page');
        const bulkBar      = page?.querySelector('#bdBulkActions');
        const countEl      = page?.querySelector('#bdSelectedCount');
        const clearBtn     = page?.querySelector('#bdBulkClear');
        const bulkDel      = page?.querySelector('#bdBulkDelete');
        const bulkExport   = page?.querySelector('#bdBulkExport');

        const selectedRows  = grid.select();
        const count         = selectedRows.length;

        if (bulkBar)  bulkBar.style.display  = count > 0 ? 'flex' : 'none';
        if (countEl)  countEl.textContent     = count;

        if (clearBtn) clearBtn.onclick = () => { grid.clearSelection(); _updateBulkBar(grid); };
    }

    // ─────────────────────────────────────────────────────────
    //  RIGHT-CLICK CONTEXT MENU
    // ─────────────────────────────────────────────────────────
    function _initContextMenu(el, grid, menuItems) {
        let _menu = null;

        el.addEventListener('contextmenu', function (e) {
            const row = e.target.closest('tr[data-uid]');
            if (!row) return;

            e.preventDefault();

            const dataItem = grid.dataItem($(row));
            if (!dataItem) return;

            // Remove existing menu
            if (_menu) _menu.remove();

            _menu = document.createElement('div');
            _menu.className = 'bd-context-menu';
            _menu.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                background: var(--bd-bg-surface);
                border: 1px solid var(--bd-border-light);
                border-radius: var(--bd-radius-md);
                box-shadow: var(--bd-shadow-lg);
                z-index: var(--bd-z-dropdown);
                padding: 4px 0;
                min-width: 160px;
                animation: bdDropIn 0.12s ease;
            `;

            menuItems.forEach(item => {
                if (item.divider) {
                    const div = document.createElement('div');
                    div.style.cssText = 'height:1px;background:var(--bd-border-light);margin:4px 0;';
                    _menu.appendChild(div);
                    return;
                }

                const btn = document.createElement('button');
                btn.style.cssText = `
                    display:flex;align-items:center;gap:8px;
                    width:100%;padding:8px 14px;
                    border:none;background:none;cursor:pointer;
                    font-family:var(--bd-font-body);font-size:0.83rem;
                    color:var(--bd-text-primary);text-align:left;
                `;
                btn.innerHTML = `<span>${item.icon || ''}</span><span>${item.text}</span>`;
                btn.onmouseenter = () => btn.style.background = 'var(--bd-bg-hover)';
                btn.onmouseleave = () => btn.style.background = '';
                btn.onclick = () => { _menu.remove(); item.action(dataItem); };
                _menu.appendChild(btn);
            });

            document.body.appendChild(_menu);

            // Close on outside click
            setTimeout(() => {
                document.addEventListener('click', function handler() {
                    if (_menu) _menu.remove();
                    document.removeEventListener('click', handler);
                });
            }, 10);

            // Reposition if off-screen
            requestAnimationFrame(() => {
                const rect = _menu.getBoundingClientRect();
                if (rect.right  > window.innerWidth)  _menu.style.left = (e.clientX - rect.width)  + 'px';
                if (rect.bottom > window.innerHeight)  _menu.style.top  = (e.clientY - rect.height) + 'px';
            });
        });
    }

    // ─────────────────────────────────────────────────────────
    //  EXPORT
    // ─────────────────────────────────────────────────────────
    function _handleExport(grid, format, opts) {
        try {
            if (format === 'excel') {
                grid.saveAsExcel();
            } else if (format === 'pdf') {
                grid.saveAsPDF();
            } else if (format === 'csv') {
                // Manual CSV export (Kendo doesn't have built-in CSV)
                const data = grid.dataSource.data().toJSON();
                _downloadCsv(data, opts.exportFileName || 'export');
            }
        } catch (err) {
            bdToast.error('Export failed. Please try again.');
        }
    }

    function _downloadCsv(data, filename) {
        if (!data.length) { bdToast.info('No data to export.'); return; }

        const keys = Object.keys(data[0]).filter(k => !k.startsWith('_'));
        const rows = [
            keys.join(','),
            ...data.map(row => keys.map(k => _csvCell(row[k])).join(','))
        ];

        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = filename + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    function _csvCell(val) {
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
    }

    // ─────────────────────────────────────────────────────────
    return { create };

})();
