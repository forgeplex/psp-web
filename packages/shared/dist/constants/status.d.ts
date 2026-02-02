/**
 * Status mapping constants for the PSP system.
 */
export declare const TRANSACTION_STATUS: {
    readonly PENDING: "pending";
    readonly SUCCESS: "success";
    readonly FAILED: "failed";
    readonly REFUNDED: "refunded";
    readonly CANCELLED: "cancelled";
    readonly PROCESSING: "processing";
};
export type TransactionStatusType = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];
export declare const TRANSACTION_STATUS_LABELS: Record<string, string>;
export declare const MERCHANT_STATUS: {
    readonly ACTIVE: "active";
    readonly INACTIVE: "inactive";
    readonly SUSPENDED: "suspended";
    readonly PENDING_REVIEW: "pending_review";
};
export type MerchantStatusType = typeof MERCHANT_STATUS[keyof typeof MERCHANT_STATUS];
export declare const MERCHANT_STATUS_LABELS: Record<string, string>;
export declare const CHANNEL_STATUS: {
    readonly ACTIVE: "active";
    readonly INACTIVE: "inactive";
    readonly MAINTENANCE: "maintenance";
};
export type ChannelStatusType = typeof CHANNEL_STATUS[keyof typeof CHANNEL_STATUS];
export declare const CHANNEL_STATUS_LABELS: Record<string, string>;
export declare const SETTLEMENT_STATUS: {
    readonly PENDING: "pending";
    readonly PROCESSING: "processing";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
};
export type SettlementStatusType = typeof SETTLEMENT_STATUS[keyof typeof SETTLEMENT_STATUS];
export declare const SETTLEMENT_STATUS_LABELS: Record<string, string>;
export declare const PAYMENT_METHODS: {
    readonly ALIPAY: "alipay";
    readonly WECHAT_PAY: "wechat_pay";
    readonly BANK_CARD: "bank_card";
    readonly UNION_PAY: "union_pay";
};
export declare const PAYMENT_METHOD_LABELS: Record<string, string>;
//# sourceMappingURL=status.d.ts.map