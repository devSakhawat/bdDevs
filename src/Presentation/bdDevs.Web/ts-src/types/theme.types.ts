export type ThemeFamily = 'default' | 'bootstrap' | 'material' | 'fluent';
export type ThemeMode = 'light' | 'dark';
export type ThemeDensity = 'compact' | 'comfortable';

export interface UserThemePreference {
    themeFamily: ThemeFamily;
    themeMode: ThemeMode;
    density: ThemeDensity;
    sidebarCollapsed: boolean;
    gridDefaults: {
        pageSize: number;
    };
}

export const DEFAULT_THEME: UserThemePreference = {
    themeFamily: 'bootstrap',
    themeMode: 'light',
    density: 'comfortable',
    sidebarCollapsed: false,
    gridDefaults: { pageSize: 20 }
};