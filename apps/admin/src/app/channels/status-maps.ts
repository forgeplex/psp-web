// 状态映射 - 与 Schema/API Spec v1.0 对齐
// ChannelStatus: inactive/active/maintenance
// HealthStatus: unknown/healthy/degraded/failed

export const channelStatusMap = {
  active: { color: 'success', text: '已启用', badge: 'processing' },
  inactive: { color: 'default', text: '已禁用', badge: 'default' },
  maintenance: { color: 'warning', text: '维护中', badge: 'warning' },
} as const;

export const healthStatusMap = {
  unknown: { color: 'default', text: '未知', icon: '⚪' },
  healthy: { color: 'success', text: '健康', icon: '🟢' },
  degraded: { color: 'warning', text: '降级', icon: '🟡' },
  failed: { color: 'error', text: '故障', icon: '🔴' },
} as const;

export type ChannelStatus = keyof typeof channelStatusMap;
export type HealthStatus = keyof typeof healthStatusMap;
