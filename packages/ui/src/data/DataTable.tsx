import React from 'react';
import { Table, type TableProps, type TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';

export interface DataTableProps<T extends Record<string, unknown>> extends Omit<TableProps<T>, 'onChange'> {
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row keys */
  selectedRowKeys?: React.Key[];
  /** Selection change handler */
  onSelectionChange?: (keys: React.Key[], rows: T[]) => void;
  /** Table change handler (pagination, filters, sort) */
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  selectable = false,
  selectedRowKeys,
  onSelectionChange,
  onTableChange,
  pagination,
  ...rest
}: DataTableProps<T>) {
  const defaultPagination: TablePaginationConfig = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    ...((typeof pagination === 'object' ? pagination : {}) as TablePaginationConfig),
  };

  return (
    <Table<T>
      rowSelection={
        selectable
          ? {
              selectedRowKeys,
              onChange: (keys, rows) => onSelectionChange?.(keys, rows),
            }
          : undefined
      }
      pagination={pagination === false ? false : defaultPagination}
      onChange={onTableChange}
      size="middle"
      style={{ borderRadius: 8, overflow: 'hidden' }}
      {...rest}
    />
  );
}
