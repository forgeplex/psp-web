/**
 * PSP Admin API Client
 *
 * 类型安全的 Admin API 客户端，基于 openapi-fetch
 */
import createClient from 'openapi-fetch';
import type { paths } from './generated/admin';
export type AdminApiClient = ReturnType<typeof createClient<paths>>;
/**
 * 创建 Admin API 客户端实例
 */
export declare function createAdminClient(options?: {
    baseUrl?: string;
    headers?: HeadersInit;
}): AdminApiClient;
/**
 * 获取默认客户端实例（懒加载）
 */
export declare function getAdminClient(): AdminApiClient;
/**
 * 配置默认客户端
 */
export declare function configureAdminClient(options: {
    baseUrl?: string;
    headers?: HeadersInit;
}): AdminApiClient;
export type { paths, components, operations } from './generated/admin';
//# sourceMappingURL=admin-client.d.ts.map