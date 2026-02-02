import React from 'react';
import { type TableProps, type TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
export interface DataTableProps<T extends Record<string, unknown>> extends Omit<TableProps<T>, 'onChange'> {
    /** Enable row selection */
    selectable?: boolean;
    /** Selected row keys */
    selectedRowKeys?: React.Key[];
    /** Selection change handler */
    onSelectionChange?: (keys: React.Key[], rows: T[]) => void;
    /** Table change handler (pagination, filters, sort) */
    onTableChange?: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<T> | SorterResult<T>[], extra: TableCurrentDataSource<T>) => void;
}
export declare function DataTable<T extends Record<string, unknown>>({ selectable, selectedRowKeys, onSelectionChange, onTableChange, pagination, ...rest }: DataTableProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DataTable.d.ts.map