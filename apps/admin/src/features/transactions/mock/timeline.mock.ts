import type { TimelineNode } from '../types';

/**
 * 正常交易时间线 Mock 数据
 * 状态流：创建 → 待支付 → 风控检查 → 风控通过 → 处理中 → 已支付 → 完成
 */
export const mockNormalTimeline: TimelineNode[] = [
  {
    status: 'created',
    label: '创建订单',
    description: '订单已创建，等待支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:00Z',
    operator: 'system',
  },
  {
    status: 'pending',
    label: '待支付',
    description: '等待用户完成支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:05Z',
    operator: 'customer',
  },
  {
    status: 'risk_checking',
    label: '风控检查中',
    description: '正在进行风险检查',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:30Z',
    operator: 'risk-engine',
  },
  {
    status: 'risk_approved',
    label: '风控通过',
    description: '风险检查已通过',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:32Z',
    operator: 'risk-engine',
  },
  {
    status: 'processing',
    label: '处理中',
    description: '正在处理支付请求',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:35Z',
    operator: 'payment-gateway',
  },
  {
    status: 'paid',
    label: '已支付',
    description: '支付已成功完成',
    completed: true,
    current: false,
    time: '2026-02-03T08:31:00Z',
    operator: 'payment-gateway',
  },
  {
    status: 'completed',
    label: '交易完成',
    description: '交易已完成，资金已结算',
    completed: true,
    current: false,
    time: '2026-02-03T08:35:00Z',
    operator: 'system',
  },
];

/**
 * 进行中交易时间线 Mock 数据
 * 当前状态：处理中
 */
export const mockInProgressTimeline: TimelineNode[] = [
  {
    status: 'created',
    label: '创建订单',
    description: '订单已创建，等待支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:00Z',
    operator: 'system',
  },
  {
    status: 'pending',
    label: '待支付',
    description: '等待用户完成支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:05Z',
    operator: 'customer',
  },
  {
    status: 'risk_checking',
    label: '风控检查中',
    description: '正在进行风险检查',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:30Z',
    operator: 'risk-engine',
  },
  {
    status: 'risk_approved',
    label: '风控通过',
    description: '风险检查已通过',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:32Z',
    operator: 'risk-engine',
  },
  {
    status: 'processing',
    label: '处理中',
    description: '正在处理支付请求，预计 1-2 分钟完成',
    completed: false,
    current: true,
    time: '2026-02-03T08:30:35Z',
    operator: 'payment-gateway',
  },
  {
    status: 'paid',
    label: '已支付',
    description: '支付已成功完成',
    completed: false,
    current: false,
  },
  {
    status: 'completed',
    label: '交易完成',
    description: '交易已完成，资金已结算',
    completed: false,
    current: false,
  },
];

/**
 * 失败交易时间线 Mock 数据
 * 失败原因：风控未通过
 */
export const mockFailedTimeline: TimelineNode[] = [
  {
    status: 'created',
    label: '创建订单',
    description: '订单已创建',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:00Z',
    operator: 'system',
  },
  {
    status: 'pending',
    label: '待支付',
    description: '等待支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:05Z',
    operator: 'customer',
  },
  {
    status: 'risk_checking',
    label: '风控检查中',
    description: '风险检查中',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:30Z',
    operator: 'risk-engine',
  },
  {
    status: 'failed',
    label: '交易失败',
    description: '风控检查未通过：高风险交易，触发风控规则 #R-1024',
    completed: false,
    current: true,
    time: '2026-02-03T08:30:35Z',
    operator: 'risk-engine',
  },
];

/**
 * 已退款交易时间线 Mock 数据
 */
export const mockRefundedTimeline: TimelineNode[] = [
  {
    status: 'created',
    label: '创建订单',
    description: '订单已创建',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:00Z',
    operator: 'system',
  },
  {
    status: 'pending',
    label: '待支付',
    description: '等待支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:05Z',
    operator: 'customer',
  },
  {
    status: 'paid',
    label: '已支付',
    description: '支付成功',
    completed: true,
    current: false,
    time: '2026-02-03T08:31:00Z',
    operator: 'payment-gateway',
  },
  {
    status: 'completed',
    label: '交易完成',
    description: '交易完成',
    completed: true,
    current: false,
    time: '2026-02-03T08:35:00Z',
    operator: 'system',
  },
  {
    status: 'refunded',
    label: '已退款',
    description: '退款已处理，资金已原路退回，预计 1-3 个工作日到账',
    completed: true,
    current: false,
    time: '2026-02-03T09:00:00Z',
    operator: 'admin',
  },
];

/**
 * 已取消交易时间线 Mock 数据
 */
export const mockCancelledTimeline: TimelineNode[] = [
  {
    status: 'created',
    label: '创建订单',
    description: '订单已创建',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:00Z',
    operator: 'system',
  },
  {
    status: 'pending',
    label: '待支付',
    description: '等待支付',
    completed: true,
    current: false,
    time: '2026-02-03T08:30:05Z',
    operator: 'customer',
  },
  {
    status: 'cancelled',
    label: '已取消',
    description: '订单已取消，原因：用户主动取消',
    completed: false,
    current: true,
    time: '2026-02-03T08:32:00Z',
    operator: 'customer',
  },
];
