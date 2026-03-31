import React from 'react';
import { SearchInput } from './SearchInput';
import { Filter, Calendar, ChevronDown } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  filters?: FilterOption[];
  onFilterChange?: (key: string, value: string) => void;
  dateRange?: {
    start?: Date;
    end?: Date;
    onChange?: (start: Date, end: Date) => void;
  };
  extra?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearch,
  filters,
  onFilterChange,
  extra,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearch}
          />
        </div>

        {/* Filters */}
        {filters && filters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {filters.map((filter) => (
              <div key={filter.key} className="relative">
                <select
                  value={filter.value}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  className="
                    appearance-none bg-gray-50 border border-gray-200 rounded-lg
                    pl-3 pr-8 py-2 text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    cursor-pointer hover:bg-gray-100 transition-colors
                  "
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Date Range */}
        {/* Date picker placeholder - Mercury style */}
        
        {/* Extra Actions */}
        {extra && (
          <div className="flex items-center gap-2 ml-auto">
            {extra}
          </div>
        )}
      </div>
    </div>
  );
}

// Re-export SearchInput for convenience
export { SearchInput };
