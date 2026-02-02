/**
 * PSP Admin API Client
 *
 * 类型安全的 Admin API 客户端，基于 openapi-fetch
 */
import createClient from 'openapi-fetch';
/**
 * 创建 Admin API 客户端实例
 */
export function createAdminClient(options) {
    return createClient({
        baseUrl: options?.baseUrl ?? '/api',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });
}
// 默认客户端实例（可选，按需使用）
let defaultClient = null;
/**
 * 获取默认客户端实例（懒加载）
 */
export function getAdminClient() {
    if (!defaultClient) {
        defaultClient = createAdminClient();
    }
    return defaultClient;
}
/**
 * 配置默认客户端
 */
export function configureAdminClient(options) {
    defaultClient = createAdminClient(options);
    return defaultClient;
}
//# sourceMappingURL=admin-client.js.map