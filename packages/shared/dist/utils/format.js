import dayjs from 'dayjs';
/**
 * Format amount as currency string.
 * @param amount - amount in minor units (cents) or major units
 * @param currency - ISO 4217 currency code
 * @param options - formatting options
 */
export function formatCurrency(amount, currency = 'CNY', options = {}) {
    const { inMinorUnits = false, showSign = false } = options;
    const value = inMinorUnits ? amount / 100 : amount;
    const formatted = new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(value));
    if (showSign && value !== 0) {
        return value > 0 ? `+${formatted}` : `-${formatted}`;
    }
    return formatted;
}
/**
 * Format a date/timestamp.
 * @param date - Date, timestamp, or ISO string
 * @param format - dayjs format string
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date)
        return '-';
    return dayjs(date).format(format);
}
/**
 * Format a date as relative time (e.g. "3 minutes ago")
 */
export function formatRelativeDate(date) {
    if (!date)
        return '-';
    const d = dayjs(date);
    const now = dayjs();
    const diffMin = now.diff(d, 'minute');
    if (diffMin < 1)
        return '刚刚';
    if (diffMin < 60)
        return `${diffMin} 分钟前`;
    const diffHour = now.diff(d, 'hour');
    if (diffHour < 24)
        return `${diffHour} 小时前`;
    const diffDay = now.diff(d, 'day');
    if (diffDay < 30)
        return `${diffDay} 天前`;
    return d.format('YYYY-MM-DD');
}
/**
 * Format large numbers with abbreviation (e.g. 1.2K, 3.5M)
 */
export function formatNumber(value) {
    if (Math.abs(value) >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString('zh-CN');
}
//# sourceMappingURL=format.js.map