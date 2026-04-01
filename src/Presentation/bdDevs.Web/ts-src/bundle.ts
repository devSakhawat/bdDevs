/* Minimal bundle exports for window.bd* services */

class ApiService {
    baseUrl: string;
    constructor(baseUrl = '') { this.baseUrl = baseUrl; }
    async get(path: string) {
        const res = await fetch(path, { credentials: 'same-origin' });
        return res.json();
    }
    async post(path: string, body: any) {
        const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' });
        return res.json();
    }
}

class ToastService {
    show(message: string, type = 'info') { console.log('[toast]', type, message); alert(message); }
}

class LoadingService {
    show() { /* implement spinner show */ }
    hide() { /* implement spinner hide */ }
}

/* Expose globals */
(window as any).bdApi = new ApiService('/');
(window as any).bdToast = new ToastService();
(window as any).bdLoading = new LoadingService();

export { };