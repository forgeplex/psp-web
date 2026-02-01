/**
 * PSP Color System
 * Converted from UIUX SYSTEM-DESIGN.md CSS variables to Ant Design Theme Token format.
 *
 * Source uses HSL CSS variables (e.g. "142 76% 36%").
 * We convert them to hex for Ant Design's token system.
 */

// ============================================================
// Base Colors (from shadcn/ui defaults in SYSTEM-DESIGN.md)
// ============================================================
export const baseColors = {
  background: '#FFFFFF',
  foreground: '#0A0A0B',
  card: '#FFFFFF',
  cardForeground: '#0A0A0B',
  primary: '#18181B',       // hsl(240 5.9% 10%)
  primaryForeground: '#FAFAFA',
  secondary: '#F4F4F5',     // hsl(240 4.8% 95.9%)
  secondaryForeground: '#18181B',
  muted: '#F4F4F5',
  mutedForeground: '#71717A', // hsl(240 3.8% 46.1%)
  accent: '#F4F4F5',
  accentForeground: '#18181B',
  destructive: '#EF4444',   // hsl(0 84.2% 60.2%)
  destructiveForeground: '#FAFAFA',
  border: '#E4E4E7',        // hsl(240 5.9% 90%)
  input: '#E4E4E7',
  ring: '#18181B',
} as const;

// ============================================================
// PSP Business Status Colors
// ============================================================
export const statusColors = {
  // Transaction Status
  success: '#22C55E',           // hsl(142 76% 36%) -> using a more vibrant green
  successBg: '#F0FDF4',         // hsl(142 76% 96%)
  pending: '#F59E0B',           // hsl(38 92% 50%)
  pendingBg: '#FFFBEB',         // hsl(38 92% 96%)
  failed: '#EF4444',            // hsl(0 84% 60%)
  failedBg: '#FEF2F2',          // hsl(0 84% 96%)
  refunded: '#A855F7',          // hsl(262 83% 58%)
  refundedBg: '#FAF5FF',        // hsl(262 83% 96%)

  // Channel Health
  healthGood: '#22C55E',
  healthWarning: '#F59E0B',
  healthCritical: '#EF4444',

  // Amount Colors
  amountPositive: '#22C55E',    // Income
  amountNegative: '#EF4444',    // Expense
} as const;

// ============================================================
// Status Config Map (for StatusBadge component)
// ============================================================
export const statusConfigMap = {
  success: {
    color: statusColors.success,
    bg: statusColors.successBg,
    label: '成功',
  },
  pending: {
    color: statusColors.pending,
    bg: statusColors.pendingBg,
    label: '处理中',
  },
  failed: {
    color: statusColors.failed,
    bg: statusColors.failedBg,
    label: '失败',
  },
  refunded: {
    color: statusColors.refunded,
    bg: statusColors.refundedBg,
    label: '已退款',
  },
  unknown: {
    color: baseColors.mutedForeground,
    bg: baseColors.muted,
    label: '未知',
  },
} as const;

export type TransactionStatus = keyof typeof statusConfigMap;
