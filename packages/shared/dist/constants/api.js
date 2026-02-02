/**
 * API endpoint constants.
 * Base URLs are loaded from environment variables at runtime.
 */
export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_PROFILE: '/auth/profile',
    // Merchants
    MERCHANTS: '/merchants',
    MERCHANT_DETAIL: (id) => `/merchants/${id}`,
    // Transactions
    TRANSACTIONS: '/transactions',
    TRANSACTION_DETAIL: (id) => `/transactions/${id}`,
    // Settlements
    SETTLEMENTS: '/settlements',
    SETTLEMENT_DETAIL: (id) => `/settlements/${id}`,
    // Channels
    CHANNELS: '/channels',
    CHANNEL_DETAIL: (id) => `/channels/${id}`,
    // Routes
    ROUTES: '/routes',
    ROUTE_DETAIL: (id) => `/routes/${id}`,
    // Rates
    RATES: '/rates',
    // Risk Control
    RISK_RULES: '/risk/rules',
    // Agents
    AGENTS: '/agents',
    AGENT_DETAIL: (id) => `/agents/${id}`,
    // Analytics
    ANALYTICS_DASHBOARD: '/analytics/dashboard',
    ANALYTICS_REPORTS: '/analytics/reports',
    // System
    SYSTEM_USERS: '/system/users',
    SYSTEM_ROLES: '/system/roles',
    SYSTEM_AUDIT_LOG: '/system/audit-log',
    // Notifications
    NOTIFICATIONS: '/notifications',
    // Monitoring
    MONITORING_ALERTS: '/monitoring/alerts',
    MONITORING_HEALTH: '/monitoring/health',
};
//# sourceMappingURL=api.js.map