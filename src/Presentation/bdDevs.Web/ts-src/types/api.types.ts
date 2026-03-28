// ── Core API Contract ──────────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    pagination: PaginationMetadata | null;
    links: LinkDto[];
    errors: FieldError[];
    correlationId: string | null;
    version: string;
    timestamp: string;
}

export interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export interface LinkDto {
    href: string;
    rel: string;
    method: string;
}

export interface FieldError {
    field: string;
    message: string;
}

// ── Grid Contract ───────────────────────────────────────────────
export interface GridResult<T> {
    items: T[];
    totalCount: number;
}