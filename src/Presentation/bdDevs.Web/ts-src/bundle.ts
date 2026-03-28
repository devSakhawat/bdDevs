import { bdApi } from './core/api-service';
import { eventBus, Events } from './core/event-bus';
import { loadingService } from './core/loading';
import { toastService } from './core/toast';
import { navigationService } from './services/navigation-service';

window.bdNav = navigationService;

declare global {
    interface Window {
        bdNav: typeof navigationService;
    }
}

declare global {
    interface Window {
        bdApi: typeof bdApi;
        bdToast: typeof toastService;
        eventBus: typeof eventBus;
        bdEvents: typeof Events;
        bdLoading: typeof loadingService;
    }
}

window.bdApi = bdApi;
window.bdToast = toastService;
window.eventBus = eventBus;
window.bdEvents = Events;
window.bdLoading = loadingService;

// DOM ready হলে init
document.addEventListener('DOMContentLoaded', () => {
    loadingService.init();
    toastService.init();
    console.debug('[bdDevs] App shell initialized');

    navigationService.apply();
});