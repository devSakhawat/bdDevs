import { themeService } from '../services/theme-service';
import type { ThemeFamily, ThemeMode, ThemeDensity } from '../types/theme.types';

interface FamilyOption {
    value: ThemeFamily;
    label: string;
    swatch: string;   // CSS color
}

const FAMILIES: FamilyOption[] = [
    { value: 'default', label: 'Default', swatch: '#1F3864' },
    { value: 'bootstrap', label: 'Bootstrap', swatch: '#0D6EFD' },
    { value: 'material', label: 'Material', swatch: '#6200EE' },
    { value: 'fluent', label: 'Fluent', swatch: '#0078D4' },
];

class ThemePicker {
    private panel: HTMLElement | null = null;
    private isOpen = false;

    init(): void {
        this._renderPanel();
        this._bindTrigger();
        this._syncUI();
    }

    // ── Render picker panel ──────────────────────────────────
    private _renderPanel(): void {
        const existing = document.getElementById('bd-theme-picker');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'bd-theme-picker';
        panel.className = 'bd-theme-picker d-none';
        panel.innerHTML = `
      <div class="bd-theme-picker__header">
        <i class="fa-solid fa-palette"></i>
        Theme Settings
      </div>

      <!-- Family -->
      <div class="bd-theme-picker__section">
        <div class="bd-theme-picker__label">Theme Family</div>
        <div class="bd-theme-family-grid" id="bd-family-grid">
          ${FAMILIES.map(f => `
            <button class="bd-theme-family-btn"
                    data-family="${f.value}"
                    title="${f.label}">
              <span class="swatch"
                    style="background:${f.swatch}"></span>
              ${f.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="bd-theme-picker__divider"></div>

      <!-- Mode -->
      <div class="bd-theme-picker__section">
        <div class="bd-theme-picker__label">Mode</div>
        <div class="bd-theme-mode-toggle">
          <button class="bd-theme-mode-btn" data-mode="light">
            <i class="fa-solid fa-sun"></i> Light
          </button>
          <button class="bd-theme-mode-btn" data-mode="dark">
            <i class="fa-solid fa-moon"></i> Dark
          </button>
        </div>
      </div>

      <div class="bd-theme-picker__divider"></div>

      <!-- Density -->
      <div class="bd-theme-picker__section">
        <div class="bd-theme-picker__label">Density</div>
        <div class="bd-density-toggle">
          <button class="bd-density-btn" data-density="comfortable">
            <i class="fa-solid fa-expand"></i><br>Comfortable
          </button>
          <button class="bd-density-btn" data-density="compact">
            <i class="fa-solid fa-compress"></i><br>Compact
          </button>
        </div>
      </div>

      <div class="bd-theme-picker__footer">
        Theme preference saved automatically
      </div>`;

        document.body.appendChild(panel);
        this.panel = panel;

        // Bind events
        panel.querySelectorAll('[data-family]').forEach(btn => {
            btn.addEventListener('click', () => {
                const family = (btn as HTMLElement).dataset.family as ThemeFamily;
                themeService.setFamily(family);
                this._syncUI();
            });
        });

        panel.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = (btn as HTMLElement).dataset.mode as ThemeMode;
                themeService.setMode(mode);
                this._syncUI();
            });
        });

        panel.querySelectorAll('[data-density]').forEach(btn => {
            btn.addEventListener('click', () => {
                const density = (btn as HTMLElement).dataset.density as ThemeDensity;
                themeService.setDensity(density);
                this._syncUI();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            const trigger = document.getElementById('bd-theme-btn');
            if (this.isOpen &&
                !panel.contains(e.target as Node) &&
                !trigger?.contains(e.target as Node)) {
                this.close();
            }
        });
    }

    private _bindTrigger(): void {
        document.getElementById('bd-theme-btn')
            ?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
    }

    // ── Sync UI to current theme ─────────────────────────────
    private _syncUI(): void {
        if (!this.panel) return;
        const pref = themeService.get();

        // Family buttons
        this.panel.querySelectorAll('[data-family]').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.family === pref.themeFamily);
        });

        // Mode buttons
        this.panel.querySelectorAll('[data-mode]').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.mode === pref.themeMode);
        });

        // Density buttons
        this.panel.querySelectorAll('[data-density]').forEach(btn => {
            const el = btn as HTMLElement;
            el.classList.toggle('active', el.dataset.density === pref.density);
        });

        // Theme icon — show moon/sun based on mode
        const icon = document.querySelector('#bd-theme-btn i');
        if (icon) {
            icon.className = pref.themeMode === 'dark'
                ? 'fa-solid fa-moon'
                : 'fa-solid fa-palette';
        }
    }

    toggle(): void { this.isOpen ? this.close() : this.open(); }

    open(): void {
        this.panel?.classList.remove('d-none');
        this.isOpen = true;
        this._syncUI();
    }

    close(): void {
        this.panel?.classList.add('d-none');
        this.isOpen = false;
    }
}

export const themePicker = new ThemePicker();