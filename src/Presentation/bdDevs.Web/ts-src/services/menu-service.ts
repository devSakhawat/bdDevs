import { bdApi } from '../core/api-service';
import { eventBus } from '../core/event-bus';


// Local type mirror
interface MenuItem {
  id: number;
  title: string;
  icon?: string;
  url?: string;
  sortOrder: number;
  children: MenuItem[];
  hasChildren: boolean;
  isGroup: boolean;
}

class MenuService {
  private menu: MenuItem[] = [];
  private loaded = false;

  // ── Load menu from API ────────────────────────────────────
  async load(): Promise<MenuItem[]> {
    if (this.loaded) return this.menu;

    try {
      const res = await bdApi.get<MenuItem[]>('/menu');
      if (res.success && res.data) {
        this.menu = res.data;
        this.loaded = true;
      }
    } catch (err) {
      console.error('[Menu] Failed to load:', err);
    }

    return this.menu;
  }

  // ── Get flat list (for command palette) ───────────────────
  getFlat(): MenuItem[] {
    const flat: MenuItem[] = [];
    const traverse = (items: MenuItem[]) => {
      items.forEach(item => {
        if (!item.isGroup && item.url) flat.push(item);
        if (item.hasChildren) traverse(item.children);
      });
    };
    traverse(this.menu);
    return flat;
  }

  // ── Search menu items ─────────────────────────────────────
  search(query: string): MenuItem[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return this.getFlat().filter(item =>
      item.title.toLowerCase().includes(q)
    );
  }

  // ── Invalidate cache ──────────────────────────────────────
  invalidate(): void {
    this.menu = [];
    this.loaded = false;
  }

  getMenu(): MenuItem[] { return this.menu; }
}

export const menuService = new MenuService();