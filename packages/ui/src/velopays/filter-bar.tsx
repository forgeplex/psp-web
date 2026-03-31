"use client";

import React from "react";
import { cn } from "@psp/shared/utils/cn";
import { Search, Download, ChevronDown } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value?: string;
    onChange?: (value: string) => void;
  }[];
  onSearch?: (value: string) => void;
  onExport?: () => void;
  className?: string;
}

export function FilterBar({
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onExport,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-4", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="relative">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange?.(e.target.value)}
              className="appearance-none pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[140px]"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        ))}

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors ml-auto"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>
    </div>
  );
}
