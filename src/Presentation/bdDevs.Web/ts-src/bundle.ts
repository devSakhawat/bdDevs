import { bdApi } from './core/api-service';
import { eventBus, Events } from './core/event-bus';
import { loadingService } from './core/loading';
import { toastService } from './core/toast';
import { navigationService } from './services/navigation-service';
import { themeService } from './services/theme-service';
import { themePicker } from './components/theme-picker';

window.bdNav = navigationService;

declare global {
    interface Window { bdNav: typeof navigationService; }
}

declare global {
    interface Window {
        bdApi: typeof bdApi;
        bdToast: typeof toastService;
        eventBus: typeof eventBus;
        bdEvents: typeof Events;
        bdLoading: typeof loadingService;
        bdTheme: typeof themeService;
    }
}

window.bdApi = bdApi;
window.bdToast = toastService;
window.eventBus = eventBus;
window.bdEvents = Events;
window.bdLoading = loadingService;
// Expose
window.bdTheme = themeService;

// DOM ready: init
document.addEventListener('DOMContentLoaded', () => {
    loadingService.init();
    toastService.init();
    navigationService.apply();
    themePicker.init(); 

    console.debug('[bdDevs] App shell initialized');
});