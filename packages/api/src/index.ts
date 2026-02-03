/**
 * @psp/api - PSP API 客户端包
 * 
 * 提供类型安全的 API 调用
 */

// Generated types
export * from './generated/admin';
export type { paths as AdminPaths, components as AdminComponents, operations as AdminOperations } from './generated/admin';

// Admin API Client
export { createAdminClient, getAdminClient, configureAdminClient } from './admin-client';
export type { AdminApiClient } from './admin-client';

// Legacy exports (保留兼容)
export * from './client';
export * from './hooks';
export * from './types';

// Merchants API
export * from './merchants';

// Export API
export * from './export';

// MFA API
export * from './mfa';
