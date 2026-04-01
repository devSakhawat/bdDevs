import type { ModalOptions } from '../types/ui.types';
import { eventBus } from '../core/event-bus';
import { loadingService } from '../core/loading';

class BdModalService {
  private instances = new Map<string, kendo.ui.Window>();

  // ── Open modal ───────────────────────────────────────────
  open(options: ModalOptions): string {
    const id = `bd-modal-${Date.now()}`;

    const {
      title = 'Dialog',
      width = 600,
      height = 'auto',
      resizable = true,
      draggable = true,
    } = options;

    // Max constraints — screen - 40px (design doc spec)
    const maxW = window.innerWidth - 40;
    const maxH = window.innerHeight - 40;

    // Resolve width/height
    const resolvedW = typeof width === 'number'
      ? Math.min(width, maxW) : width;
    const resolvedH = typeof height === 'number'
      ? Math.min(height, maxH) : height;

    // Create container
    const container = document.createElement('div');
    container.id = id;
    document.body.appendChild(container);

    // Set content
    if (options.content) {
      container.innerHTML = options.content;
    } else if (options.url) {
      // Show spinner while loading
      container.innerHTML = `
        <div style="display:flex;align-items:center;
                    justify-content:center;
                    min-height:200px;">
          <span class="bd-spinner"></span>
        </div>`;
    }

    // Init Kendo Window
    const $container = (window as any).$(container);
    $container.kendoWindow({
      title: title,
      width: resolvedW,
      resizable: resizable,
      draggable: draggable,
      modal: true,
      visible: false,
      animation: {
        open: { effects: 'fade:in', duration: 200 },
        close: { effects: 'fade:out', duration: 150 },
      },
      close: () => {
        options.onClose?.();
        setTimeout(() => this._destroy(id), 300);
      },
      open: () => {
        options.onOpen?.();
      },
    });

    const win = $container.data('kendoWindow');
    this.instances.set(id, win);

    // Set height if specified (not auto)
    if (height !== 'auto') {
      win.wrapper.css('max-height', `${maxH}px`);
      win.element.css({
        'height': resolvedH,
        'overflow-y': 'auto',
      });
    } else {
      // Auto height — inner scrolls if > maxH
      win.element.css({
        'max-height': `${maxH - 60}px`,  // -60 for title bar
        'overflow-y': 'auto',
      });
    }

    // Load remote content
    if (options.url) {
      this._loadContent(id, options.url, win);
    }

    // Center and show
    win.center().open();

    // Keyboard — Escape closes
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close(id);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return id;
  }

  // ── Close specific modal ──────────────────────────────────
  close(id: string): void {
    this.instances.get(id)?.close();
  }

  // ── Close all ─────────────────────────────────────────────
  closeAll(): void {
    this.instances.forEach((win) => win.close());
  }

  // ── Confirm dialog ────────────────────────────────────────
  confirm(message: string, title = 'Confirm'): Promise<boolean> {
    return new Promise(resolve => {
      const id = this.open({
        title,
        width: 440,
        resizable: false,
        draggable: false,
        content: `
          <div style="padding: var(--bd-space-5);">
            <div style="display:flex;gap:var(--bd-space-3);
                        align-items:flex-start;margin-bottom:var(--bd-space-5)">
              <i class="fa-solid fa-circle-question"
                 style="color:var(--bd-warning);font-size:1.5rem;
                        flex-shrink:0;margin-top:2px"></i>
              <p style="margin:0;font-size:var(--bd-text-base);
                        color:var(--bd-text-primary);
                        line-height:var(--bd-lh-relaxed)">
                ${message}
              </p>
            </div>
            <div class="bd-btn-group bd-btn-group--right">
              <button class="bd-btn bd-btn-secondary"
                      id="${id}-cancel">Cancel</button>
              <button class="bd-btn bd-btn-primary"
                      id="${id}-confirm">Confirm</button>
            </div>
          </div>`,
        onClose: () => resolve(false),
      });

      // Small delay for DOM
      setTimeout(() => {
        document.getElementById(`${id}-confirm`)
          ?.addEventListener('click', () => {
            resolve(true);
            this.close(id);
          });
        document.getElementById(`${id}-cancel`)
          ?.addEventListener('click', () => {
            resolve(false);
            this.close(id);
          });
      }, 50);
    });
  }

  // ── Delete confirm ────────────────────────────────────────
  confirmDelete(itemName: string): Promise<boolean> {
    return new Promise(resolve => {
      const id = this.open({
        title: 'Confirm Delete',
        width: 440,
        resizable: false,
        draggable: false,
        content: `
          <div style="padding: var(--bd-space-5)">
            <div style="display:flex;gap:var(--bd-space-3);
                        align-items:flex-start;margin-bottom:var(--bd-space-5)">
              <i class="fa-solid fa-triangle-exclamation"
                 style="color:var(--bd-danger);font-size:1.5rem;
                        flex-shrink:0;margin-top:2px"></i>
              <div>
                <p style="margin:0 0 var(--bd-space-2);
                           font-weight:var(--bd-fw-semibold);
                           color:var(--bd-text-primary)">
                  Delete ${itemName}?
                </p>
                <p style="margin:0;font-size:var(--bd-text-sm);
                           color:var(--bd-text-secondary)">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div class="bd-btn-group bd-btn-group--right">
              <button class="bd-btn bd-btn-secondary"
                      id="${id}-cancel">Cancel</button>
              <button class="bd-btn bd-btn-danger"
                      id="${id}-delete">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>`,
        onClose: () => resolve(false),
      });

      setTimeout(() => {
        document.getElementById(`${id}-delete`)
          ?.addEventListener('click', () => {
            resolve(true);
            this.close(id);
          });
        document.getElementById(`${id}-cancel`)
          ?.addEventListener('click', () => {
            resolve(false);
            this.close(id);
          });
      }, 50);
    });
  }

  // ── Load remote content ───────────────────────────────────
  private async _loadContent(
    id: string,
    url: string,
    win: kendo.ui.Window
  ): Promise<void> {
    try {
      const res = await fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const html = await res.text();
      win.content(html);
      win.center();  // Re-center after content loads
    } catch (err) {
      win.content(`
        <div class="bd-alert bd-alert--danger" style="margin:16px">
          <i class="fa-solid fa-circle-xmark bd-alert__icon"></i>
          <div class="bd-alert__body">Failed to load content.</div>
        </div>`);
    }
  }

  // ── Destroy ───────────────────────────────────────────────
  private _destroy(id: string): void {
    const win = this.instances.get(id);
    if (win) {
      win.destroy();
      document.getElementById(id)?.remove();
      this.instances.delete(id);
    }
  }
}

export const bdModal = new BdModalService();