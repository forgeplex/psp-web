import React from 'react';
import { Badge } from '../components/ui/badge';

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
  variant: 'success' | 'warning' | 'error' | 'default' | 'violet';
  dotColor: string;
}> = {
  success: { label: 'Ativo', variant: 'success', dotColor: 'bg-emerald-500' },
  ativo: { label: 'Ativo', variant: 'success', dotColor: 'bg-emerald-500' },
  pago: { label: 'Pago', variant: 'success', dotColor: 'bg-emerald-500' },
  active: { label: 'Active', variant: 'success', dotColor: 'bg-emerald-500' },
  paid: { label: 'Paid', variant: 'success', dotColor: 'bg-emerald-500' },
  warning: { label: 'Pendente', variant: 'warning', dotColor: 'bg-amber-500' },
  pendente: { label: 'Pendente', variant: 'warning', dotColor: 'bg-amber-500' },
  pausado: { label: 'Pausado', variant: 'warning', dotColor: 'bg-amber-500' },
  pending: { label: 'Pending', variant: 'warning', dotColor: 'bg-amber-500' },
  paused: { label: 'Paused', variant: 'warning', dotColor: 'bg-amber-500' },
  error: { label: 'Falhou', variant: 'error', dotColor: 'bg-red-500' },
  falhou: { label: 'Falhou', variant: 'error', dotColor: 'bg-red-500' },
  cancelado: { label: 'Cancelado', variant: 'error', dotColor: 'bg-red-500' },
  failed: { label: 'Failed', variant: 'error', dotColor: 'bg-red-500' },
  canceled: { label: 'Canceled', variant: 'error', dotColor: 'bg-red-500' },
  default: { label: 'Expirado', variant: 'default', dotColor: 'bg-gray-400' },
  expirado: { label: 'Expirado', variant: 'default', dotColor: 'bg-gray-400' },
  expired: { label: 'Expired', variant: 'default', dotColor: 'bg-gray-400' },
  reembolsado: { label: 'Reembolsado', variant: 'violet', dotColor: 'bg-violet-500' },
  refunded: { label: 'Refunded', variant: 'violet', dotColor: 'bg-violet-500' },
};

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.default;
  
  return (
    <Badge 
      variant={config.variant}
      dot
      dotColor={config.dotColor}
      className={className}
    >
      {children || config.label}
    </Badge>
  );
}
