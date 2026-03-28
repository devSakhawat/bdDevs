import type { ToastOptions, ToastType } from '../types/ui.types';

const DURATIONS: Record<ToastType, number> = {
    success: 3000,
    info: 4000,
    warning: 5000,
    error: 7000,
};

const ICONS: Record<ToastType, string> = {
    success: 'fa-circle-check',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark',
};

class ToastService {
    private container: HTMLElement | null = null;

    init(): void {
        this.container = document.getElementById('bd-toast-host');
    }

    show(options: ToastOptions): void {
        if (!this.container) return;

        const duration = options.duration ?? DURATIONS[options.type];
        const id = `toast-${Date.now()}`;

        const el = document.createElement('div');
        el.id = id;
        el.className = `bd-toast bd-toast--${options.type} slide-in`;
        el.innerHTML = `
      <div class="bd-toast__icon">
        <i class="fa-solid ${ICONS[options.type]}"></i>
      </div>
      <div class="bd-toast__body">
        ${options.title
                ? `<div class="bd-toast__title">${options.title}</div>`
                : ''}
        <div class="bd-toast__message">${options.message}</div>
        ${options.actionLabel
                ? `<a class="bd-toast__action"
               href="${options.actionUrl ?? '#'}">
               ${options.actionLabel} →
             </a>`
                : ''}
      </div>
      <button class="bd-toast__close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="bd-toast__progress">
        <div class="bd-toast__progress-bar"
             style="animation-duration: ${duration}ms"></div>
      </div>`;

        // Close button
        el.querySelector('.bd-toast__close')
            ?.addEventListener('click', () => this._dismiss(el));

        // Action callback
        if (options.onAction) {
            el.querySelector('.bd-toast__action')
                ?.addEventListener('click', (e) => {
                    e.preventDefault();
                    options.onAction!();
                    this._dismiss(el);
                });
        }

        this.container.appendChild(el);

        // Auto dismiss
        setTimeout(() => this._dismiss(el), duration);
    }

    // Shortcuts
    success(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.show({ type: 'success', message, title, actionLabel, actionUrl });
    }
    error(message: string, title = 'Error') {
        this.show({ type: 'error', message, title });
    }
    warning(message: string, title?: string) {
        this.show({ type: 'warning', message, title });
    }
    info(message: string, title?: string) {
        this.show({ type: 'info', message, title });
    }

    private _dismiss(el: HTMLElement): void {
        el.classList.add('slide-out');
        setTimeout(() => el.remove(), 300);
    }
}

export const toastService = new ToastService();