import { bdApi } from '../core/api-service';
import { eventBus, Events } from '../core/event-bus';
import { bdModal } from '../components/bd-modal';

interface SessionInfo {
  userId: string;
  profileId: string;
  fullName: string;
  branchId: string;
  roles: string[];
  permissions: string[];
  expiresAt: Date;
}

class AuthService {
  private session: SessionInfo | null = null;
  private guardTimer: ReturnType<typeof setInterval> | null = null;
  private warningShown = false;

  // ── Init (call on boot) ───────────────────────────────────
  init(): void {
    this._parseSession();
    this._startGuard();

    // Listen for token refresh
    eventBus.on(Events.TOKEN_REFRESHED, () => {
      this._parseSession();
      this.warningShown = false;
    });
  }

  // ── Session info ──────────────────────────────────────────
  getSession(): SessionInfo | null { return this.session; }

  hasPermission(permission: string): boolean {
    return this.session?.permissions.includes(permission) ?? false;
  }

  hasRole(role: string): boolean {
    return this.session?.roles.includes(role) ?? false;
  }

  hasAnyPermission(...perms: string[]): boolean {
    return perms.some(p => this.hasPermission(p));
  }

  // ── Permission-based UI ───────────────────────────────────
  // Hide elements user has no permission for
  applyPermissions(context: HTMLElement | Document = document): void {
    context.querySelectorAll<HTMLElement>('[data-permission]')
      .forEach(el => {
        const perm = el.dataset.permission!;
        if (!this.hasPermission(perm)) {
          el.style.display = 'none';
        }
      });

    context.querySelectorAll<HTMLElement>('[data-role]')
      .forEach(el => {
        const role = el.dataset.role!;
        if (!this.hasRole(role)) {
          el.style.display = 'none';
        }
      });
  }

  // ── Logout ────────────────────────────────────────────────
  async logout(): Promise<void> {
    try {
      await bdApi.post('/auth/logout', {});
    } catch { /* ignore */ }

    bdApi.clearToken();
    this.session = null;

    if (this.guardTimer) {
      clearInterval(this.guardTimer);
    }

    window.location.href = '/auth/login';
  }

  // ── Private ───────────────────────────────────────────────
  private _parseSession(): void {
    const token = bdApi.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      this.session = {
        userId: payload.sub,
        profileId: payload.profileId,
        fullName: payload.fullName ?? '',
        branchId: payload.branchId ?? '',
        roles: Array.isArray(payload.role)
          ? payload.role
          : [payload.role].filter(Boolean),
        permissions: Array.isArray(payload.permission)
          ? payload.permission
          : [payload.permission].filter(Boolean),
        expiresAt: new Date(payload.exp * 1000),
      };
    } catch {
      console.warn('[Auth] Failed to parse token');
    }
  }

  private _startGuard(): void {
    if (this.guardTimer) clearInterval(this.guardTimer);

    // Check every 30 seconds
    this.guardTimer = setInterval(async () => {
      if (!bdApi.getToken()) return;

      // 3 minutes before expiry — show warning (design doc spec)
      if (bdApi.isTokenExpiringSoon(3) && !this.warningShown) {
        this.warningShown = true;
        eventBus.emit(Events.SESSION_EXPIRING);
        this._showExpiryWarning();
      }

      // Expired → logout
      if (bdApi.isTokenExpired()) {
        this._showExpiredModal();
      }

    }, 30_000);
  }

  private _showExpiryWarning(): void {
    bdModal.confirm(
      'Your session will expire in 3 minutes. Continue working?',
      'Session Expiring'
    ).then(async (confirmed) => {
      if (confirmed) {
        const ok = await bdApi.refreshToken();
        if (!ok) {
          this._showExpiredModal();
        }
      } else {
        await this.logout();
      }
    });
  }

  private _showExpiredModal(): void {
    // Non-dismissable
    bdModal.open({
      title: 'Session Expired',
      resizable: false,
      draggable: false,
      width: 400,
      content: `
        <div style="padding: var(--bd-space-5); text-align: center;">
          <i class="fa-solid fa-lock"
             style="font-size:2rem;color:var(--bd-warning);
                    margin-bottom:var(--bd-space-4);display:block"></i>
          <p style="margin:0 0 var(--bd-space-4);
                    color:var(--bd-text-primary)">
            Your session has expired. Please log in again.
          </p>
          <button class="bd-btn bd-btn-primary"
                  onclick="window.location.href='/auth/login'">
            <i class="fa-solid fa-right-to-bracket"></i>
            Log In Again
          </button>
        </div>`,
    });
  }
}

export const authService = new AuthService();