/**
 * Status mapping constants for the PSP system.
 */
// Transaction Status
export const TRANSACTION_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled',
    PROCESSING: 'processing',
};
export const TRANSACTION_STATUS_LABELS = {
    [TRANSACTION_STATUS.PENDING]: '待处理',
    [TRANSACTION_STATUS.SUCCESS]: '成功',
    [TRANSACTION_STATUS.FAILED]: '失败',
    [TRANSACTION_STATUS.REFUNDED]: '已退款',
    [TRANSACTION_STATUS.CANCELLED]: '已取消',
    [TRANSACTION_STATUS.PROCESSING]: '处理中',
};
// Merchant Status
export const MERCHANT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING_REVIEW: 'pending_review',
};
export const MERCHANT_STATUS_LABELS = {
    [MERCHANT_STATUS.ACTIVE]: '正常',
    [MERCHANT_STATUS.INACTIVE]: '未激活',
    [MERCHANT_STATUS.SUSPENDED]: '已停用',
    [MERCHANT_STATUS.PENDING_REVIEW]: '待审核',
};
// Channel Status
export const CHANNEL_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    MAINTENANCE: 'maintenance',
};
export const CHANNEL_STATUS_LABELS = {
    [CHANNEL_STATUS.ACTIVE]: '正常',
    [CHANNEL_STATUS.INACTIVE]: '停用',
    [CHANNEL_STATUS.MAINTENANCE]: '维护中',
};
// Settlement Status
export const SETTLEMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
};
export const SETTLEMENT_STATUS_LABELS = {
    [SETTLEMENT_STATUS.PENDING]: '待结算',
    [SETTLEMENT_STATUS.PROCESSING]: '结算中',
    [SETTLEMENT_STATUS.COMPLETED]: '已完成',
    [SETTLEMENT_STATUS.FAILED]: '结算失败',
};
// Payment Methods
export const PAYMENT_METHODS = {
    ALIPAY: 'alipay',
    WECHAT_PAY: 'wechat_pay',
    BANK_CARD: 'bank_card',
    UNION_PAY: 'union_pay',
};
export const PAYMENT_METHOD_LABELS = {
    [PAYMENT_METHODS.ALIPAY]: '支付宝',
    [PAYMENT_METHODS.WECHAT_PAY]: '微信支付',
    [PAYMENT_METHODS.BANK_CARD]: '银行卡',
    [PAYMENT_METHODS.UNION_PAY]: '银联',
};
//# sourceMappingURL=status.js.map