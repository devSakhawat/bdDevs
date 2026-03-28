// Kendo Grid থেকে আসা request shape
// তোমার existing CRMGridOptions-এর সাথে compatible
export interface GridRequestOptions {
    skip: number;
    take: number;
    page: number;
    pageSize: number;
    sort: GridSort[];
    filter: GridFilterContainer | null;
}

export interface GridSort {
    field: string;
    dir: 'asc' | 'desc';
}

export interface GridFilterContainer {
    logic: 'and' | 'or';
    filters: GridFilter[];
}

export interface GridFilter {
    field: string;
    operator: GridOperator;
    value: string | number | boolean | null;
}

export type GridOperator =
    | 'eq' | 'neq'
    | 'contains' | 'doesnotcontain'
    | 'startswith' | 'endswith'
    | 'gt' | 'gte' | 'lt' | 'lte'
    | 'isnull' | 'isnotnull'
    | 'isempty' | 'isnotempty';