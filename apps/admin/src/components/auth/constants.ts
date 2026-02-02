import { brandColors } from '@psp/shared';

/**
 * Auth module style constants
 * Uses brandColors (Indigo) instead of baseColors.primary
 */
export const authStyles = {
  // Primary button styles
  primaryButton: {
    background: brandColors.primary,
    borderColor: brandColors.primary,
    height: 42,
  },
  primaryButtonHover: {
    background: brandColors.primaryHover,
    borderColor: brandColors.primaryHover,
  },

  // Input focus colors
  inputFocus: {
    borderColor: brandColors.primary,
    boxShadow: `0 0 0 3px ${brandColors.primaryLight}`,
  },

  // Icon colors
  iconColor: brandColors.primary,
  iconBg: brandColors.primaryLight,

  // Page background
  pageBg: '#F8FAFC',

  // Card styles
  card: {
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },

  // Text colors (from design system)
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    muted: '#94A3B8',
  },

  // Border colors
  border: {
    default: '#E2E8F0',
    focus: brandColors.primary,
  },
} as const;

export { brandColors };
