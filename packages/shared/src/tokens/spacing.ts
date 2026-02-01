/**
 * PSP Spacing System
 * Base unit: 4px
 * From UIUX SYSTEM-DESIGN.md
 */

export const spacing = {
  1: 4,    // 0.25rem
  2: 8,    // 0.5rem
  3: 12,   // 0.75rem
  4: 16,   // 1rem
  5: 20,   // 1.25rem
  6: 24,   // 1.5rem
  8: 32,   // 2rem
  10: 40,  // 2.5rem
  12: 48,  // 3rem
  16: 64,  // 4rem
} as const;

export const borderRadius = {
  sm: 4,
  md: 8, // 0.5rem = --radius from SYSTEM-DESIGN.md
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const zIndex = {
  dropdown: 50,
  sticky: 100,
  modal: 200,
  toast: 300,
} as const;

/** Layout constants from SYSTEM-DESIGN.md */
export const layout = {
  headerHeight: 56,
  sidebarWidth: 240,
  sidebarCollapsedWidth: 64,
  pagePadding: 24,
  cardGap: 24,
} as const;
