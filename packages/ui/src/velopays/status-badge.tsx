"use client";

import React from "react";
import { cn } from "@psp/shared/utils/cn";

export type StatusType =
  | "success"
  | "pending"
  | "failed"
  | "active"
  | "paused"
  | "cancelled"
  | "expired"
  | "refunded"
  | "trialing";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { bg: string; text: string; label: string; dot: string }
> = {
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Success",
    dot: "bg-emerald-500",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "Pending",
    dot: "bg-amber-500",
  },
  failed: {
    bg: "bg-red-50",
    text: "text-red-700",
    label: "Failed",
    dot: "bg-red-500",
  },
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Active",
    dot: "bg-emerald-500",
  },
  paused: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "Paused",
    dot: "bg-amber-500",
  },
  cancelled: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: "Cancelled",
    dot: "bg-slate-400",
  },
  expired: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: "Expired",
    dot: "bg-slate-400",
  },
  refunded: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    label: "Refunded",
    dot: "bg-slate-400",
  },
  trialing: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    label: "Trial",
    dot: "bg-indigo-500",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {label || config.label}
    </span>
  );
}
