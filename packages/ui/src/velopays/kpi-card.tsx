"use client";

import React from "react";
import { cn } from "@psp/shared/utils/cn";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

export interface KpiCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  icon: LucideIcon;
  iconColor?: "indigo" | "emerald" | "amber" | "blue" | "red";
}

const colorVariants = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  red: "bg-red-50 text-red-600",
};

export function KpiCard({
  title,
  value,
  trend,
  icon: Icon,
  iconColor = "indigo",
}: KpiCardProps) {
  const trendColor =
    trend?.direction === "up"
      ? "text-emerald-600"
      : trend?.direction === "down"
      ? "text-red-600"
      : "text-slate-500";

  const TrendIcon = trend?.direction === "up" ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <span className={cn("flex items-center text-xs font-medium", trendColor)}>
                {trend.direction !== "neutral" && (
                  <TrendIcon className="w-3 h-3 mr-0.5" />
                )}
                {trend.value}
              </span>
              {trend.label && (
                <span className="text-xs text-slate-400">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", colorVariants[iconColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900 tracking-tight font-mono">
        {value}
      </p>
    </div>
  );
}
