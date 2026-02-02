/**
 * API endpoint constants.
 * Base URLs are loaded from environment variables at runtime.
 */
export declare const API_ENDPOINTS: {
    readonly AUTH_LOGIN: "/auth/login";
    readonly AUTH_LOGOUT: "/auth/logout";
    readonly AUTH_REFRESH: "/auth/refresh";
    readonly AUTH_PROFILE: "/auth/profile";
    readonly MERCHANTS: "/merchants";
    readonly MERCHANT_DETAIL: (id: string) => string;
    readonly TRANSACTIONS: "/transactions";
    readonly TRANSACTION_DETAIL: (id: string) => string;
    readonly SETTLEMENTS: "/settlements";
    readonly SETTLEMENT_DETAIL: (id: string) => string;
    readonly CHANNELS: "/channels";
    readonly CHANNEL_DETAIL: (id: string) => string;
    readonly ROUTES: "/routes";
    readonly ROUTE_DETAIL: (id: string) => string;
    readonly RATES: "/rates";
    readonly RISK_RULES: "/risk/rules";
    readonly AGENTS: "/agents";
    readonly AGENT_DETAIL: (id: string) => string;
    readonly ANALYTICS_DASHBOARD: "/analytics/dashboard";
    readonly ANALYTICS_REPORTS: "/analytics/reports";
    readonly SYSTEM_USERS: "/system/users";
    readonly SYSTEM_ROLES: "/system/roles";
    readonly SYSTEM_AUDIT_LOG: "/system/audit-log";
    readonly NOTIFICATIONS: "/notifications";
    readonly MONITORING_ALERTS: "/monitoring/alerts";
    readonly MONITORING_HEALTH: "/monitoring/health";
};
//# sourceMappingURL=api.d.ts.map