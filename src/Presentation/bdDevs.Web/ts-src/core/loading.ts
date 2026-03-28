import { eventBus, Events } from './event-bus';

type LoadingLevel = 'app' | 'page' | 'component';

class LoadingService {
    private pageLoadCount = 0;
    private progressBar: HTMLElement | null = null;
    private progressTimer: ReturnType<typeof setTimeout> | null = null;

    init(): void {
        this.progressBar = document.getElementById('bd-progress-bar');
        eventBus.on(Events.PAGE_LOAD_START, () => this.startPage());
        eventBus.on(Events.PAGE_LOAD_END, () => this.endPage());
    }

    // ── App Shell Loading ─────────────────────────────────────────
    showAppSkeleton(): void {
        document.getElementById('bd-app-skeleton')
            ?.classList.remove('d-none');
        document.getElementById('bd-main-content')
            ?.classList.add('d-none');
    }

    hideAppSkeleton(): void {
        const skeleton = document.getElementById('bd-app-skeleton');
        const content = document.getElementById('bd-main-content');
        skeleton?.classList.add('fade-out');
        setTimeout(() => {
            skeleton?.classList.add('d-none');
            skeleton?.classList.remove('fade-out');
            content?.classList.remove('d-none');
        }, 300);
    }

    // ── Page Loading (NProgress style) ───────────────────────────
    startPage(): void {
        this.pageLoadCount++;
        if (!this.progressBar) return;
        this.progressBar.style.width = '0%';
        this.progressBar.style.opacity = '1';
        this._animateTo(70);
    }

    endPage(): void {
        this.pageLoadCount = Math.max(0, this.pageLoadCount - 1);
        if (this.pageLoadCount > 0) return;
        if (!this.progressBar) return;
        this._animateTo(100);
        setTimeout(() => {
            if (this.progressBar) this.progressBar.style.opacity = '0';
        }, 300);
    }

    // ── Component Loading ─────────────────────────────────────────
    showComponentSpinner(container: HTMLElement | string): void {
        const el = typeof container === 'string'
            ? document.getElementById(container)
            : container;
        if (!el) return;
        const spinner = document.createElement('div');
        spinner.className = 'bd-component-spinner';
        spinner.innerHTML = '<span class="bd-spinner"></span>';
        el.appendChild(spinner);
    }

    hideComponentSpinner(container: HTMLElement | string): void {
        const el = typeof container === 'string'
            ? document.getElementById(container)
            : container;
        el?.querySelector('.bd-component-spinner')?.remove();
    }

    private _animateTo(target: number): void {
        if (!this.progressBar) return;
        if (this.progressTimer) clearTimeout(this.progressTimer);
        const current = parseFloat(this.progressBar.style.width || '0');
        const step = (target - current) / 10;
        let curr = current;

        const tick = () => {
            curr += step;
            if (this.progressBar)
                this.progressBar.style.width = `${Math.min(curr, target)}%`;
            if (curr < target)
                this.progressTimer = setTimeout(tick, 30);
        };
        tick();
    }
}

export const loadingService = new LoadingService();