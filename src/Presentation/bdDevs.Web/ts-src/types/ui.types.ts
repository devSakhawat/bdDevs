export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastOptions {
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;        // ms — default per type
    actionLabel?: string;
    actionUrl?: string;
    onAction?: () => void;
}

export interface ModalOptions {
    title: string;
    url?: string;        // partial view URL
    content?: string;        // inline HTML
    width?: number | string;
    height?: number | string;
    maxWidth?: number;        // default: screen - 40px
    maxHeight?: number;        // default: screen - 40px
    resizable?: boolean;
    draggable?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
}

export interface NotificationItem {
    id: number;
    type: ToastType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
}