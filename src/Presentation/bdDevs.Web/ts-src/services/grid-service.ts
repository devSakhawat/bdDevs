import { bdApi } from '../core/api-service';
import { eventBus, Events } from '../core/event-bus';
import { loadingService } from '../core/loading';
import type {
  GridRequestOptions,
  GridSort,
  GridFilterContainer
} from '../types/grid.types';
import type { GridResult } from '../types/api.types';

// ── Column config helper type ──────────────────────────────
export interface BdGridColumn extends kendo.ui.GridColumn {
  permissionKey?: string;   // hide if no permission
}

export interface BdGridConfig<T> {
  element: string | HTMLElement;
  endpoint: string;
  columns: BdGridColumn[];
  pageSize?: number;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
  selectable?: boolean;         // checkbox selection
  onRowSelect?: (rows: T[]) => void;
  onDblClick?: (row: T) => void;
  toolbar?: BdGridToolbar;
  height?: number | string;
  permissions?: Record<string, boolean>;
}

export interface BdGridToolbar {
  newLabel?: string;
  onNew?: () => void;
  showExport?: boolean;
  showRefresh?: boolean;
  showColumns?: boolean;
  searchable?: boolean;
  extraButtons?: BdToolbarButton[];
}

export interface BdToolbarButton {
  label: string;
  icon: string;
  onClick: () => void;
  type?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
}

// ── Grid instance wrapper ──────────────────────────────────
export class BdGrid<T = Record<string, unknown>> {
  private kendoGrid: kendo.ui.Grid | null = null;
  private config: BdGridConfig<T>;
  private currentOpts: GridRequestOptions;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private selectedRows: T[] = [];

  constructor(config: BdGridConfig<T>) {
    this.config = config;
    this.currentOpts = {
      skip: 0,
      take: config.pageSize ?? 20,
      page: 1,
      pageSize: config.pageSize ?? 20,
      sort: config.sortField
        ? [{ field: config.sortField,
          dir: config.sortDir ?? 'asc' }]
        : [],
      filter: null,
    };
  }

  // ── Init ─────────────────────────────────────────────────
  async init(): Promise<void> {
    const el = typeof this.config.element === 'string'
      ? document.getElementById(this.config.element)
      : this.config.element;

    if (!el) {
      console.error('[BdGrid] Element not found:', this.config.element);
      return;
    }

    // Show skeleton while first load
    this._showSkeleton(el);

    // Filter columns by permission
    const columns = this._filterColumns(this.config.columns);

    // Build Kendo Grid config
    const kendoCfg: kendo.ui.GridOptions = {
      dataSource: this._buildDataSource(),
      columns: this._buildColumns(columns),
      pageable: {
        pageSize: this.currentOpts.pageSize,
        pageSizes: [20, 50, 100],
        buttonCount: 5,
        info: true,
        refresh: false,
      },
      sortable: { mode: 'multiple', allowUnsort: true },
      filterable: false,    // Custom filter via search
      resizable: true,
      reorderable: true,
      scrollable: true,
      navigatable: true,
      height: this.config.height ?? '100%',
      noRecords: {
        template: this._emptyTemplate(),
      },
      dataBound: () => this._onDataBound(),
      change: () => this._onSelectionChange(),
    };

    // Toolbar
    if (this.config.toolbar) {
      kendoCfg.toolbar = [{ template: this._buildToolbar() }];
    }

    // Init Kendo Grid
    this._hideSkeleton(el);
    const $el = (window as any).$(el);
    $el.kendoGrid(kendoCfg);
    this.kendoGrid = $el.data('kendoGrid');

    // Bind extra events
    this._bindEvents(el);

    // Bind grid refresh event
    eventBus.on(Events.GRID_REFRESH, () => this.refresh());
  }

  // ── Public API ────────────────────────────────────────────
  async refresh(): Promise<void> {
    this.kendoGrid?.dataSource.read();
  }

  getSelected(): T[] { return this.selectedRows; }

  setFilter(filter: GridFilterContainer | null): void {
    this.currentOpts.filter = filter;
    this.currentOpts.skip = 0;
    this.currentOpts.page = 1;
    this.refresh();
  }

  search(term: string): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      if (term.trim()) {
        this.currentOpts.filter = {
          logic: 'or',
          filters: this._buildSearchFilters(term),
        };
      } else {
        this.currentOpts.filter = null;
      }
      this.currentOpts.skip = 0;
      this.currentOpts.page = 1;
      this.refresh();
    }, 300);  // 300ms debounce — design doc spec
  }

  exportTo(format: 'excel' | 'pdf' | 'csv'): void {
    if (!this.kendoGrid) return;
    if (format === 'excel') this.kendoGrid.saveAsExcel();
    if (format === 'pdf') this.kendoGrid.saveAsPDF();
    if (format === 'csv') {
      // CSV export via custom logic
      this._exportCsv();
    }
  }

  destroy(): void {
    this.kendoGrid?.destroy();
    eventBus.off(Events.GRID_REFRESH, () => this.refresh());
  }

  // ── DataSource ───────────────────────────────────────────
  private _buildDataSource(): kendo.data.DataSource {
    return new kendo.data.DataSource({
      transport: {
        read: async (options: any) => {
          // Sync Kendo paging/sorting to our options
          this._syncFromKendo(options.data);

          loadingService.showComponentSpinner(
            typeof this.config.element === 'string'
              ? (document.getElementById(this.config.element) as HTMLElement)
              : this.config.element
          );

          try {
            const result = await bdApi.grid<T>(
              this.config.endpoint,
              this.currentOpts
            );
            options.success({
              data: result.items,
              total: result.totalCount,
            });
          } catch (err) {
            console.error('[BdGrid] Fetch error:', err);
            options.error(err);
          } finally {
            loadingService.hideComponentSpinner(
              typeof this.config.element === 'string'
                ? (document.getElementById(this.config.element) as HTMLElement)
                : this.config.element
            );
          }
        }
      },
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
      pageSize: this.currentOpts.pageSize,
      schema: {
        data: (res: any) => res.data,
        total: (res: any) => res.total,
      }
    });
  }

  // ── Columns ──────────────────────────────────────────────
  private _buildColumns(cols: BdGridColumn[]): kendo.ui.GridColumn[] {
    const result: kendo.ui.GridColumn[] = [];

    // Checkbox column if selectable
    if (this.config.selectable) {
      result.push({
        selectable: true,
        width: 50,
        headerAttributes: { style: 'text-align: center' },
        attributes: { style: 'text-align: center' },
      });
    }

    result.push(...cols);
    return result;
  }

  private _filterColumns(cols: BdGridColumn[]): BdGridColumn[] {
    if (!this.config.permissions) return cols;
    return cols.filter(col => {
      if (!col.permissionKey) return true;
      return !!this.config.permissions?.[col.permissionKey];
    });
  }

  // ── Toolbar HTML ─────────────────────────────────────────
  private _buildToolbar(): string {
    const tb = this.config.toolbar!;
    const id = typeof this.config.element === 'string'
      ? this.config.element
      : 'bd-grid';

    let html = `<div class="bd-grid-toolbar" id="${id}-toolbar">`;

    // Left side
    html += `<div class="bd-grid-toolbar__left">`;

    if (tb.onNew) {
      html += `<button class="bd-btn bd-btn-primary bd-btn--sm"
                        id="${id}-btn-new">
                 <i class="fa-solid fa-plus"></i>
                 ${tb.newLabel ?? 'New'}
               </button>`;
    }

    if (tb.extraButtons?.length) {
      tb.extraButtons.forEach((btn, i) => {
        html += `<button class="bd-btn bd-btn-${btn.type ?? 'secondary'} bd-btn--sm"
                          id="${id}-extra-${i}">
                   <i class="fa-solid ${btn.icon}"></i>
                   ${btn.label}
                 </button>`;
      });
    }

    if (tb.showExport !== false) {
      html += `<div class="bd-dropdown-wrap" style="position:relative">
                 <button class="bd-btn bd-btn-ghost bd-btn--sm"
                         id="${id}-btn-export">
                   <i class="fa-solid fa-download"></i> Export
                   <i class="fa-solid fa-chevron-down"
                      style="font-size:10px"></i>
                 </button>
                 <div class="bd-context-menu d-none" id="${id}-export-menu">
                   <button class="bd-context-menu__item"
                           id="${id}-export-excel">
                     <i class="fa-solid fa-file-excel"></i> Excel
                   </button>
                   <button class="bd-context-menu__item"
                           id="${id}-export-pdf">
                     <i class="fa-solid fa-file-pdf"></i> PDF
                   </button>
                   <button class="bd-context-menu__item"
                           id="${id}-export-csv">
                     <i class="fa-solid fa-file-csv"></i> CSV
                   </button>
                 </div>
               </div>`;
    }

    html += `</div>`;

    // Right side
    html += `<div class="bd-grid-toolbar__right">`;

    if (tb.searchable !== false) {
      html += `<div class="bd-grid-search">
                 <i class="fa-solid fa-magnifying-glass"></i>
                 <input type="text"
                        id="${id}-search"
                        class="bd-input bd-input--sm"
                        placeholder="Search..."
                        autocomplete="off" />
               </div>`;
    }

    if (tb.showRefresh !== false) {
      html += `<button class="bd-btn bd-btn-ghost bd-btn-icon bd-btn--sm"
                        id="${id}-btn-refresh" title="Refresh">
                 <i class="fa-solid fa-rotate-right"></i>
               </button>`;
    }

    if (tb.showColumns !== false) {
      html += `<button class="bd-btn bd-btn-ghost bd-btn-icon bd-btn--sm"
                        id="${id}-btn-columns" title="Column Chooser">
                 <i class="fa-solid fa-table-columns"></i>
               </button>`;
    }

    html += `</div></div>`;
    return html;
  }

  // ── Bind toolbar events ───────────────────────────────────
  private _bindEvents(el: HTMLElement): void {
    const id = typeof this.config.element === 'string'
      ? this.config.element : 'bd-grid';
    const tb = this.config.toolbar;

    // New button
    if (tb?.onNew) {
      document.getElementById(`${id}-btn-new`)
        ?.addEventListener('click', tb.onNew);
    }

    // Extra buttons
    tb?.extraButtons?.forEach((btn, i) => {
      document.getElementById(`${id}-extra-${i}`)
        ?.addEventListener('click', btn.onClick);
    });

    // Refresh
    document.getElementById(`${id}-btn-refresh`)
      ?.addEventListener('click', () => this.refresh());

    // Column chooser
    document.getElementById(`${id}-btn-columns`)
      ?.addEventListener('click', () => {
        this.kendoGrid?.showColumn(0);   // opens column chooser
      });

    // Export dropdown toggle
    document.getElementById(`${id}-btn-export`)
      ?.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById(`${id}-export-menu`);
        menu?.classList.toggle('d-none');
      });

    document.getElementById(`${id}-export-excel`)
      ?.addEventListener('click', () => this.exportTo('excel'));
    document.getElementById(`${id}-export-pdf`)
      ?.addEventListener('click', () => this.exportTo('pdf'));
    document.getElementById(`${id}-export-csv`)
      ?.addEventListener('click', () => this.exportTo('csv'));

    // Search (300ms debounce — design doc spec)
    const searchInput = document.getElementById(`${id}-search`);
    searchInput?.addEventListener('input', (e) => {
      this.search((e.target as HTMLInputElement).value);
    });

    // Ctrl+N → new
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'n' && tb?.onNew) {
        e.preventDefault();
        tb.onNew();
      }
    });

    // Double click → edit
    if (this.config.onDblClick) {
      el.addEventListener('dblclick', (e) => {
        const tr = (e.target as HTMLElement).closest('tr');
        if (!tr) return;
        const dataItem = this.kendoGrid?.dataItem(tr) as T;
        if (dataItem) this.config.onDblClick!(dataItem);
      });
    }

    // Close export on outside click
    document.addEventListener('click', () => {
      document.getElementById(`${id}-export-menu`)
        ?.classList.add('d-none');
    });
  }

  // ── Selection ─────────────────────────────────────────────
  private _onSelectionChange(): void {
    if (!this.kendoGrid || !this.config.onRowSelect) return;
    const rows = this.kendoGrid.selectedKeyNames();
    this.selectedRows = rows.map(key =>
      this.kendoGrid!.dataSource.get(key) as T
    );
    this.config.onRowSelect(this.selectedRows);
  }

  // ── DataBound ─────────────────────────────────────────────
  private _onDataBound(): void {
    const total = this.kendoGrid?.dataSource.total() ?? 0;

    // Toggle empty state
    const emptyState = document.getElementById('bd-empty-state');
    if (emptyState) {
      emptyState.style.display = total === 0 ? 'flex' : 'none';
    }

    // Animate rows in
    const rows = this.kendoGrid?.tbody.find('tr');
    rows?.each((i: number, row: HTMLElement) => {
      row.style.animationDelay = `${i * 0.03}s`;
      row.classList.add('bd-row-in');
    });
  }

  // ── Sync options from Kendo ───────────────────────────────
  private _syncFromKendo(data: any): void {
    if (data.page) this.currentOpts.page = data.page;
    if (data.pageSize) this.currentOpts.pageSize = data.pageSize;
    if (data.skip !== undefined) this.currentOpts.skip = data.skip;
    if (data.take) this.currentOpts.take = data.take;

    if (data.sort?.length) {
      this.currentOpts.sort = data.sort.map((s: any): GridSort => ({
        field: s.field,
        dir: s.dir,
      }));
    }
  }

  // ── Search filters ────────────────────────────────────────
  private _buildSearchFilters(term: string) {
    // Build contains filter for all string columns
    const stringCols = this.config.columns
      .filter(c => c.field && typeof c.field === 'string')
      .map(c => c.field as string);

    return stringCols.map(field => ({
      field,
      operator: 'contains' as const,
      value: term,
    }));
  }

  // ── Empty state template ──────────────────────────────────
  private _emptyTemplate(): string {
    return `<div class="bd-empty-state" style="min-height:200px">
              <div class="bd-empty-state__icon">
                <i class="fa-solid fa-inbox"></i>
              </div>
              <h3 class="bd-empty-state__title">No records found</h3>
              <p class="bd-empty-state__description">
                Try adjusting your search or filters.
              </p>
            </div>`;
  }

  // ── Skeleton ──────────────────────────────────────────────
  private _showSkeleton(el: HTMLElement): void {
    const rows = Array(5).fill(0).map(() =>
      `<div class="bd-grid-skeleton__row">
        ${Array(5).fill(0).map((_, i) =>
        `<div class="bd-skeleton-cell bd-shimmer
                ${i === 0 ? 'bd-skeleton-cell--sm'
          : i === 2 ? 'bd-skeleton-cell--lg'
            : ''}">
          </div>`
      ).join('')}
       </div>`
    ).join('');

    el.innerHTML = `
      <div class="bd-grid-skeleton" id="bd-grid-skel">
        <div class="bd-grid-skeleton__header">
          ${Array(5).fill(0).map(() =>
      `<div class="bd-skeleton-cell bd-shimmer"></div>`
    ).join('')}
        </div>
        ${rows}
      </div>`;
  }

  private _hideSkeleton(el: HTMLElement): void {
    el.innerHTML = '';
  }

  // ── CSV Export ────────────────────────────────────────────
  private _exportCsv(): void {
    const grid = this.kendoGrid;
    if (!grid) return;

    const cols = grid.columns.filter((c: any) => c.field);
    const headers = cols.map((c: any) => c.title ?? c.field).join(',');

    const rows = grid.dataSource.data().map((item: any) =>
      cols.map((c: any) => {
        const val = item[c.field] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');

    const blob = new Blob([`${headers}\n${rows}`],
      { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}

// ── Factory function (window.bdGrid) ─────────────────────
class GridService {
  create<T>(config: BdGridConfig<T>): BdGrid<T> {
    const grid = new BdGrid<T>(config);
    grid.init();
    return grid;
  }
}

export const gridService = new GridService();