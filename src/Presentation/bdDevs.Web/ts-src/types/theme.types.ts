export type ThemeFamily = 'default' | 'default_orange' | 'default_purple' | 'bootstrap' | 'material' | 'material_pacific' | 'material_lime' | 'material_smoke' | 'fluent' | 'classic_green' | 'classic_lavender' | 'classic_main' | 'classic_metro' | 'classic_opal' | 'classic_silver' ;
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