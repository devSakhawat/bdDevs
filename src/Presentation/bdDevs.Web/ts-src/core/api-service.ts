import type { ApiResponse, GridResult } from '../types/api.types';
import type { GridRequestOptions } from '../types/grid.types';
import { eventBus, Events } from './event-bus';

// Token storage key
const TOKEN_KEY = 'bd_access_token';
const EXPIRY_KEY = 'bd_token_expiry';

class BdApiService {
    private readonly baseUrl = '/api';

    // ── Token Management ───────────────────────────────────────────
    setToken(token: string, expiresAt: string): void {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(EXPIRY_KEY, expiresAt);
    }

    clearToken(): void {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(EXPIRY_KEY);
    }

    getToken(): string | null {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    getTokenExpiry(): Date | null {
        const v = sessionStorage.getItem(EXPIRY_KEY);
        return v ? new Date(v) : null;
    }

    isTokenExpired(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return true;
        return new Date() >= expiry;
    }

    isTokenExpiringSoon(thresholdMinutes = 3): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return true;
        const threshold = new Date();
        threshold.setMinutes(threshold.getMinutes() + thresholdMinutes);
        return threshold >= expiry;
    }

    // ── HTTP Methods ───────────────────────────────────────────────
    async get<T>(url: string, params?: Record<string, string | number | boolean>)
        : Promise<ApiResponse<T>> {
        const qs = params
            ? '?' + new URLSearchParams(
                Object.entries(params).map(([k, v]) => [k, String(v)])
            ).toString()
            : '';
        return this._fetch<T>(`${url}${qs}`, 'GET');
    }

    async post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
        return this._fetch<T>(url, 'POST', body);
    }

    async put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
        return this._fetch<T>(url, 'PUT', body);
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        return this._fetch<T>(url, 'DELETE');
    }

    // ── Grid Fetch — replaces Kendo DataSource transport ──────────
    async grid<T>(
        endpoint: string,
        options: GridRequestOptions
    ): Promise<GridResult<T>> {
        const response = await this.post<GridResult<T>>(endpoint, options);
        if (!response.success || !response.data) {
            throw new Error(
                response.errors?.[0]?.message ?? 'Grid fetch failed'
            );
        }
        return response.data;
    }

    // ── Silent Token Refresh ───────────────────────────────────────
    async refreshToken(): Promise<boolean> {
        try {
            const res = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'   // HttpOnly cookie auto-sent
            });
            if (!res.ok) return false;

            const data: ApiResponse<{ accessToken: string; expiresAt: string }>
                = await res.json();

            if (data.success && data.data) {
                this.setToken(data.data.accessToken, data.data.expiresAt);
                eventBus.emit(Events.TOKEN_REFRESHED);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // ── Core Fetch ─────────────────────────────────────────────────
    private async _fetch<T>(
        url: string,
        method: string,
        body?: unknown
    ): Promise<ApiResponse<T>> {
        const correlationId = crypto.randomUUID();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Correlation-Id': correlationId,
        };

        const token = this.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${this.baseUrl}${url}`, {
            method,
            headers,
            credentials: 'include',
            body: body !== undefined ? JSON.stringify(body) : undefined
        });

        // 401 → try silent refresh once
        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                // Retry original request with new token
                headers['Authorization'] = `Bearer ${this.getToken()!}`;
                const retry = await fetch(`${this.baseUrl}${url}`, {
                    method, headers, credentials: 'include',
                    body: body !== undefined ? JSON.stringify(body) : undefined
                });
                if (retry.ok) return retry.json();
            }
            // Refresh failed → logout
            eventBus.emit(Events.LOGOUT);
            window.location.href = '/auth/login';
            return Promise.reject(new Error('Session expired'));
        }

        return response.json();
    }
}

export const bdApi = new BdApiService();