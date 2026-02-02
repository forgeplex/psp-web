/**
 * @psp/api - PSP API 客户端包
 *
 * 提供类型安全的 API 调用
 */
export * from './generated/admin';
export type { paths as AdminPaths, components as AdminComponents, operations as AdminOperations } from './generated/admin';
export { createAdminClient, getAdminClient, configureAdminClient } from './admin-client';
export type { AdminApiClient } from './admin-client';
export * from './client';
export * from './hooks';
export * from './types';
//# sourceMappingURL=index.d.ts.map