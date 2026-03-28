// Internal pub/sub — loosely couple components
type EventHandler<T = unknown> = (data: T) => void;

class EventBus {
    private readonly handlers = new Map<string, EventHandler[]>();

    on<T>(event: string, handler: EventHandler<T>): void {
        if (!this.handlers.has(event))
            this.handlers.set(event, []);
        this.handlers.get(event)!.push(handler as EventHandler);
    }

    off<T>(event: string, handler: EventHandler<T>): void {
        const list = this.handlers.get(event) ?? [];
        this.handlers.set(event, list.filter(h => h !== handler));
    }

    emit<T>(event: string, data?: T): void {
        this.handlers.get(event)?.forEach(h => h(data));
    }

    // One-time listener
    once<T>(event: string, handler: EventHandler<T>): void {
        const wrapper: EventHandler<T> = (data) => {
            handler(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

export const eventBus = new EventBus();

// Well-known events
export const Events = {
    // Auth
    TOKEN_REFRESHED: 'auth:tokenRefreshed',
    SESSION_EXPIRING: 'auth:sessionExpiring',
    LOGOUT: 'auth:logout',
    // Theme
    THEME_CHANGED: 'theme:changed',
    // Loading
    PAGE_LOAD_START: 'loading:pageStart',
    PAGE_LOAD_END: 'loading:pageEnd',
    // Notifications
    NOTIFICATION_PUSH: 'notification:push',
    NOTIFICATION_READ: 'notification:read',
    // Grid
    GRID_REFRESH: 'grid:refresh',
} as const;