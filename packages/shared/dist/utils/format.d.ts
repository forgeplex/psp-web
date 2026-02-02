/**
 * Format amount as currency string.
 * @param amount - amount in minor units (cents) or major units
 * @param currency - ISO 4217 currency code
 * @param options - formatting options
 */
export declare function formatCurrency(amount: number, currency?: string, options?: {
    inMinorUnits?: boolean;
    showSign?: boolean;
}): string;
/**
 * Format a date/timestamp.
 * @param date - Date, timestamp, or ISO string
 * @param format - dayjs format string
 */
export declare function formatDate(date: string | number | Date | null | undefined, format?: string): string;
/**
 * Format a date as relative time (e.g. "3 minutes ago")
 */
export declare function formatRelativeDate(date: string | number | Date | null | undefined): string;
/**
 * Format large numbers with abbreviation (e.g. 1.2K, 3.5M)
 */
export declare function formatNumber(value: number): string;
//# sourceMappingURL=format.d.ts.map