import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

export function KpiCard({ title, value, subtitle, trend, icon, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-500">
          {title}
        </span>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <span className="text-3xl font-bold text-gray-900 tabular-nums">
          {value}
        </span>
      </div>

      {/* Trend / Subtitle */}
      <div className="mt-3 flex items-center gap-2">
        {trend && (
          <div
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${trend.direction === 'up' 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-red-50 text-red-600'
              }
            `}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
        {(subtitle || trend?.label) && (
          <span className="text-xs text-gray-500">
            {subtitle || trend?.label}
          </span>
        )}
      </div>
    </div>
  );
}
