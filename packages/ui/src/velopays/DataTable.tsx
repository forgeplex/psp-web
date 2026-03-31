import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange?: (page: number, pageSize: number) => void;
  };
  rowKey?: keyof T | ((record: T) => string);
  onRowClick?: (record: T) => void;
  emptyText?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  pagination,
  rowKey,
  onRowClick,
  emptyText = 'Nenhum dado encontrado',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record);
    if (typeof rowKey === 'string') return String(record[rowKey] ?? index);
    return String(index);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderPagination = () => {
    if (!pagination) return null;
    
    const { current, pageSize, total, onChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);
    
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">{total} registros</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange?.(1, pageSize)}
            disabled={current === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange?.(current - 1, pageSize)}
            disabled={current === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-700 px-2">
            {current} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange?.(current + 1, pageSize)}
            disabled={current === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange?.(totalPages, pageSize)}
            disabled={current === totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.sorter ? 'cursor-pointer select-none' : ''}
                style={{ width: col.width, textAlign: col.align }}
                onClick={() => col.sorter && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.title}
                  {col.sorter && sortKey === col.key &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ))}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-indigo-500" />
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center text-gray-400">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((record, index) => (
              <TableRow
                key={getRowKey(record, index)}
                onClick={() => onRowClick?.(record)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {columns.map((col) => {
                  const value = record[col.key];
                  return (
                    <TableCell
                      key={col.key}
                      style={{ textAlign: col.align }}
                    >
                      {col.render ? col.render(value, record) : String(value ?? '-')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {renderPagination()}
    </div>
  );
}
