import type {
    ThemeFamily, ThemeMode, ThemeDensity, UserThemePreference
} from '../types/theme.types';
import { DEFAULT_THEME } from '../types/theme.types';
import { eventBus, Events } from '../core/event-bus';
import { bdApi } from '../core/api-service';

// Kendo CDN base — appsettings থেকে বা hardcode
const KENDO_BASE = '/lib/kendo/styles';

// Kendo theme file map
const KENDO_THEME_FILES: Record<ThemeFamily, Record<ThemeMode, string>> = {
    default: { light: 'default-main.css', dark: 'default-main-dark.css' },
    default_orange: { light: 'default-orange.css', dark: 'default-main-dark.css' },
    default_purple: { light: 'default-purple.css', dark: 'default-main-dark.css' },
    bootstrap: { light: 'bootstrap-4.css', dark: 'bootstrap-4-dark.css' },
    material: { light: 'material-main', dark: 'material-main-dark.css' },
    material_pacific: { light: 'material-pacific.css', dark: 'material-pacific-dark.css' },
    material_lime: { light: 'material-lime.css', dark: 'material-lime-dark.css' },
    material_smoke: { light: 'material-smoke.css', dark: 'material-main-dark.css' },
    fluent: { light: 'fluent-main.css', dark: 'fluent-main-dark.css' },
    classic_green: { light: 'classic-green.css', dark: 'classic-green-dark.css' },
    classic_lavender: { light: 'classic-lavender.css', dark: 'classic-lavender-dark.css' },
    classic_main: { light: 'classic-main', dark: 'classic-main-dark.css' },
    classic_metro: { light: 'classic-metro.css', dark: 'classic-metro-dark.css' },
    classic_opal: { light: 'classic-opal.css', dark: 'classic-opal-dark.css' },
    classic_silver: { light: 'classic-silver', dark: 'classic-silver-dark.css' },
};

class ThemeService {
    private current: UserThemePreference = { ...DEFAULT_THEME };
    private _saving = false;

    // ── Init (called on app boot) ────────────────────────────
    init(): void {
        // 1. Load from cookie (server-set — no flicker)
        const fromCookie = this._loadFromCookie();
        if (fromCookie) {
            this.current = fromCookie;
        } else {
            // 2. Fallback: localStorage
            const fromStorage = this._loadFromStorage();
            if (fromStorage) {
                this.current = fromStorage;
            } else {
                // 3. OS preference detection (first visit)
                const prefersDark = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches;
                this.current.themeMode = prefersDark ? 'dark' : 'light';
            }
        }

        // Apply without saving (already persisted)
        this._applyToDOM(this.current, false);

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set theme
                const hasManual = !!this._loadFromStorage();
                if (!hasManual) {
                    this.setMode(e.matches ? 'dark' : 'light');
                }
            });
    }

    // ── Public API ───────────────────────────────────────────
    get(): UserThemePreference {
        return { ...this.current };
    }

    async setFamily(family: ThemeFamily): Promise<void> {
        this.current.themeFamily = family;
        await this._applyToDOM(this.current, true);
    }

    async setMode(mode: ThemeMode): Promise<void> {
        this.current.themeMode = mode;
        await this._applyToDOM(this.current, true);
    }

    async setDensity(density: ThemeDensity): Promise<void> {
        this.current.density = density;
        await this._applyToDOM(this.current, true);
    }

    async setAll(pref: Partial<UserThemePreference>): Promise<void> {
        this.current = { ...this.current, ...pref };
        await this._applyToDOM(this.current, true);
    }

    setSidebarState(collapsed: boolean): void {
        this.current.sidebarCollapsed = collapsed;
        this._saveToStorage(this.current);
        // No DB call for sidebar — too frequent
    }

    // ── Apply to DOM ─────────────────────────────────────────
    private async _applyToDOM(
        pref: UserThemePreference,
        persist: boolean
    ): Promise<void> {
        const { themeFamily, themeMode, density } = pref;
        const html = document.documentElement;

        // 1. HTML data attributes (CSS selectors use these)
        html.setAttribute('data-theme-family', themeFamily);
        html.setAttribute('data-theme-mode', themeMode);
        html.setAttribute('data-density', density);

        // 2. Swap Kendo CSS link (no page reload)
        this._swapKendoTheme(themeFamily, themeMode);

        // 3. Emit for other components
        eventBus.emit(Events.THEME_CHANGED, pref);

        // 4. Persist
        if (persist) {
            this._saveToStorage(pref);
            this._saveToCookie(pref);
            await this._saveToDB(pref);
        }
    }

    private _swapKendoTheme(family: ThemeFamily, mode: ThemeMode): void {
        const file = KENDO_THEME_FILES[family]?.[mode]
            ?? KENDO_THEME_FILES.bootstrap.light;
        const href = `${KENDO_BASE}/${file}`;

        let link = document.getElementById('kendo-theme') as HTMLLinkElement;

        if (!link) {
            link = document.createElement('link');
            link.id = 'kendo-theme';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        if (link.href !== href) {
            // Preload new theme, then swap — prevents flash
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.as = 'style';
            preload.href = href;
            document.head.appendChild(preload);

            // Small delay for preload to start
            requestAnimationFrame(() => {
                link.href = href;
                preload.remove();
            });
        }
    }

    // ── Storage ──────────────────────────────────────────────
    private _saveToStorage(pref: UserThemePreference): void {
        try {
            localStorage.setItem('bd_theme_pref', JSON.stringify(pref));
        } catch { /* ignore */ }
    }

    private _loadFromStorage(): UserThemePreference | null {
        try {
            const raw = localStorage.getItem('bd_theme_pref');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    private _saveToCookie(pref: UserThemePreference): void {
        // Server reads this for no-flicker SSR
        const val = `${pref.themeFamily}|${pref.themeMode}|${pref.density}`;
        document.cookie =
            `bd_theme=${encodeURIComponent(val)};path=/;max-age=31536000;SameSite=Lax`;
    }

    private _loadFromCookie(): UserThemePreference | null {
        try {
            const match = document.cookie.match(/bd_theme=([^;]+)/);
            if (!match) return null;
            const [family, mode, density] = decodeURIComponent(match[1]).split('|');
            if (!family || !mode || !density) return null;
            return {
                ...DEFAULT_THEME,
                themeFamily: family as ThemeFamily,
                themeMode: mode as ThemeMode,
                density: density as ThemeDensity,
            };
        } catch { return null; }
    }

    // ── DB Persist ───────────────────────────────────────────
    private async _saveToDB(pref: UserThemePreference): Promise<void> {
        if (this._saving) return;  // debounce
        this._saving = true;

        try {
            await bdApi.put('/user/preference/theme', {
                themeFamily: pref.themeFamily,
                themeMode: pref.themeMode,
                density: pref.density,
                sidebarCollapsed: pref.sidebarCollapsed,
                gridDefaults: pref.gridDefaults,
            });
        } catch (err) {
            console.warn('[Theme] DB save failed (non-critical):', err);
            // localStorage already saved — not critical
        } finally {
            setTimeout(() => { this._saving = false; }, 1000);
        }
    }
}

export const themeService = new ThemeService();