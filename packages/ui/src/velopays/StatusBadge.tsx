import React from 'react';

type StatusType = 
  | 'success' | 'ativo' | 'pago' | 'active' | 'paid'
  | 'warning' | 'pendente' | 'pausado' | 'pending' | 'paused'
  | 'error' | 'falhou' | 'cancelado' | 'failed' | 'canceled'
  | 'default' | 'expirado' | 'expired' | 'reembolsado' | 'refunded';

export interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  className?: string;
}

const statusConfig: Record<string, { 
  label: string; 
  dotColor: string;
  bgColor: string;
  textColor: string;
}> = {
  // Success / Active / Paid
  success: { label: 'Ativo', dotColor: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  ativo: { label: 'Ativo', dotColor: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  pago: { label: 'Pago', dotColor: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  active: { label: 'Active', dotColor: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  paid: { label: 'Paid', dotColor: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  
  // Warning / Pending / Paused
  warning: { label: 'Pendente', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  pendente: { label: 'Pendente', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  pausado: { label: 'Pausado', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  pending: { label: 'Pending', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  paused: { label: 'Paused', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  
  // Error / Failed / Canceled
  error: { label: 'Falhou', dotColor: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  falhou: { label: 'Falhou', dotColor: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  cancelado: { label: 'Cancelado', dotColor: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  failed: { label: 'Failed', dotColor: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  canceled: { label: 'Canceled', dotColor: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  
  // Default / Expired / Refunded
  default: { label: 'Expirado', dotColor: 'bg-gray-400', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  expirado: { label: 'Expirado', dotColor: 'bg-gray-400', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  expired: { label: 'Expired', dotColor: 'bg-gray-400', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  reembolsado: { label: 'Reembolsado', dotColor: 'bg-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-700' },
  refunded: { label: 'Refunded', dotColor: 'bg-violet-500', bgColor: 'bg-violet-50', textColor: 'text-violet-700' },
};

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.default;
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bgColor} ${config.textColor}
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {children || config.label}
    </span>
  );
}
