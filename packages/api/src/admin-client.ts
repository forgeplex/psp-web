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
export function createAdminClient(options?: {
  baseUrl?: string;
  headers?: HeadersInit;
}): AdminApiClient {
  return createClient<paths>({
    baseUrl: options?.baseUrl ?? '/api',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

// 默认客户端实例（可选，按需使用）
let defaultClient: AdminApiClient | null = null;

/**
 * 获取默认客户端实例（懒加载）
 */
export function getAdminClient(): AdminApiClient {
  if (!defaultClient) {
    defaultClient = createAdminClient();
  }
  return defaultClient;
}

/**
 * 配置默认客户端
 */
export function configureAdminClient(options: {
  baseUrl?: string;
  headers?: HeadersInit;
}): AdminApiClient {
  defaultClient = createAdminClient(options);
  return defaultClient;
}

// Re-export types for convenience
export type { paths, components, operations } from './generated/admin';
