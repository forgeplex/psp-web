/**
 * PSP Admin - MFA API Hooks
 *
 * MFA 认证相关的 API 调用和类型定义
 * 对接 BE 的 /api/admin/mfa/* 和 /api/admin/auth/mfa/* 端点
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
// ─── Query Keys ──────────────────────────────────────────────
export const mfaKeys = {
    all: ['mfa'],
    status: () => [...mfaKeys.all, 'status'],
    methods: () => [...mfaKeys.all, 'methods'],
};
// ─── Hooks ──────────────────────────────────────────────────
/**
 * 获取 MFA 状态
 */
export function useMfaStatus(sessionId) {
    return useQuery({
        queryKey: mfaKeys.status(),
        queryFn: async () => {
            const { data } = await apiClient.get('/api/admin/mfa/status', {
                headers: sessionId ? { 'X-Session-ID': sessionId } : undefined,
            });
            return data;
        },
        enabled: !!sessionId,
    });
}
/**
 * 获取 MFA 方法列表
 */
export function useMfaMethods() {
    return useQuery({
        queryKey: mfaKeys.methods(),
        queryFn: async () => {
            const { data } = await apiClient.get('/api/admin/mfa/methods');
            return data.methods;
        },
    });
}
/**
 * 初始化 TOTP 设置
 */
export function useTotpSetup() {
    return useMutation({
        mutationFn: async ({ sessionId }) => {
            const { data } = await apiClient.post('/api/admin/mfa/totp/setup', {}, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
    });
}
/**
 * 绑定 TOTP (验证码确认)
 */
export function useTotpBind() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sessionId, code }) => {
            const { data } = await apiClient.post('/api/admin/mfa/totp/bind', { code }, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mfaKeys.status() });
            queryClient.invalidateQueries({ queryKey: mfaKeys.methods() });
        },
    });
}
/**
 * 验证 MFA (登录流程)
 */
export function useMfaVerify() {
    return useMutation({
        mutationFn: async ({ sessionId, ...request }) => {
            const { data } = await apiClient.post('/api/admin/auth/mfa/verify', request, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
    });
}
/**
 * 设置主要 MFA 方法
 */
export function useSetPrimaryMfa() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ mfaId }) => {
            await apiClient.post('/api/admin/mfa/primary', { mfa_id: mfaId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mfaKeys.status() });
            queryClient.invalidateQueries({ queryKey: mfaKeys.methods() });
        },
    });
}
/**
 * 禁用 MFA 方法
 */
export function useDisableMfa() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ mfaId }) => {
            await apiClient.post(`/api/admin/mfa/${mfaId}/disable`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mfaKeys.status() });
            queryClient.invalidateQueries({ queryKey: mfaKeys.methods() });
        },
    });
}
/**
 * 删除 MFA 方法
 */
export function useDeleteMfa() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ mfaId }) => {
            await apiClient.delete(`/api/admin/mfa/${mfaId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mfaKeys.status() });
            queryClient.invalidateQueries({ queryKey: mfaKeys.methods() });
        },
    });
}
/**
 * 重新生成备用码
 */
export function useRegenerateBackupCodes() {
    return useMutation({
        mutationFn: async ({ currentCode }) => {
            const { data } = await apiClient.post('/api/admin/mfa/backup-codes/regenerate', { current_mfa_code: currentCode });
            return data;
        },
    });
}
// ─── Passkey Hooks ──────────────────────────────────────────
/**
 * 获取 Passkey 注册选项
 */
export function usePasskeyRegistrationOptions() {
    return useMutation({
        mutationFn: async ({ sessionId }) => {
            const { data } = await apiClient.post('/api/admin/mfa/passkey/registration/options', {}, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
    });
}
/**
 * 完成 Passkey 注册
 */
export function usePasskeyRegistrationComplete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ sessionId, credential }) => {
            const { data } = await apiClient.post('/api/admin/mfa/passkey/registration/complete', credential, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mfaKeys.status() });
            queryClient.invalidateQueries({ queryKey: mfaKeys.methods() });
        },
    });
}
/**
 * 获取 Passkey 认证选项
 */
export function usePasskeyAuthenticationOptions() {
    return useMutation({
        mutationFn: async ({ sessionId }) => {
            const { data } = await apiClient.post('/api/admin/mfa/passkey/authentication/options', {}, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
    });
}
/**
 * 完成 Passkey 认证
 */
export function usePasskeyAuthenticationVerify() {
    return useMutation({
        mutationFn: async ({ sessionId, credential }) => {
            const { data } = await apiClient.post('/api/admin/mfa/passkey/authentication/verify', credential, { headers: { 'X-Session-ID': sessionId } });
            return data;
        },
    });
}
//# sourceMappingURL=mfa.js.map