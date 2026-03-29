import { bdApi } from './core/api-service';
import { eventBus, Events } from './core/event-bus';
import { loadingService } from './core/loading';
import { toastService } from './core/toast';
import { navigationService } from './services/navigation-service';
import { themeService } from './services/theme-service';
import { themePicker } from './components/theme-picker';
import { gridService } from './services/grid-service';
import { bdModal } from './components/bd-modal';
import { formGuard } from './components/form-guard';
import { authService } from './services/auth-service';
import { menuService } from './services/menu-service';


declare global {
  interface Window {
    bdApi: typeof bdApi;
    bdToast: typeof toastService;
    bdLoading: typeof loadingService;
    bdNav: typeof navigationService;
    bdTheme: typeof themeService;
    bdGrid: typeof gridService;
    bdModal: typeof bdModal;
    bdFormGuard: typeof formGuard;
    bdAuth: typeof authService;
    bdMenu: typeof menuService;
    eventBus: typeof eventBus;
    bdEvents: typeof Events;

    // Form toggle helpers
    bdShowForm: (title?: string) => void;
    bdHideForm: () => void;
    bdFormSaving: (saving: boolean) => void;
  }
}

window.bdApi = bdApi;
window.bdToast = toastService;
window.bdLoading = loadingService;
window.bdNav = navigationService;
window.bdTheme = themeService;
window.bdGrid = gridService;
window.bdModal = bdModal;
window.bdFormGuard = formGuard;
window.bdAuth = authService;
window.bdMenu = menuService;
window.eventBus = eventBus;
window.bdEvents = Events;


// DOM ready: init
document.addEventListener('DOMContentLoaded', () => {
  loadingService.init();
  toastService.init();
  themeService.init();
  navigationService.apply();
  themePicker.init();
  authService.init();
  formGuard.applyToNavigation();

  console.debug('[bdDevCRM] All services initialized ✓');
});