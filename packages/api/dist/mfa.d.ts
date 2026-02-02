/**
 * PSP Admin - MFA API Hooks
 *
 * MFA 认证相关的 API 调用和类型定义
 * 对接 BE 的 /api/admin/mfa/* 和 /api/admin/auth/mfa/* 端点
 */
import type { AxiosError } from 'axios';
import type { ApiError } from './hooks';
export type MfaMethodType = 'totp' | 'passkey';
export interface MfaMethod {
    id: string;
    method: MfaMethodType;
    name?: string;
    is_primary: boolean;
    enabled: boolean;
    created_at: string;
    last_used_at?: string;
}
export interface MfaStatus {
    enabled: boolean;
    has_totp: boolean;
    has_passkey: boolean;
    primary_method?: MfaMethodType;
    methods: MfaMethod[];
    backup_codes_remaining: number;
}
export interface TotpSetupResponse {
    secret: string;
    qr_code_uri: string;
    backup_codes: string[];
}
export interface TotpBindRequest {
    code: string;
}
export interface MfaVerifyRequest {
    method: MfaMethodType;
    code?: string;
    credential?: object;
}
export interface MfaVerifyResponse {
    success: boolean;
    access_token?: string;
    refresh_token?: string;
    backup_codes_remaining?: number;
}
export interface PasskeyRegistrationOptions {
    publicKey: PublicKeyCredentialCreationOptions;
}
export interface PasskeyAuthenticationOptions {
    publicKey: PublicKeyCredentialRequestOptions;
}
export declare const mfaKeys: {
    all: readonly ["mfa"];
    status: () => readonly ["mfa", "status"];
    methods: () => readonly ["mfa", "methods"];
};
/**
 * 获取 MFA 状态
 */
export declare function useMfaStatus(sessionId?: string): import("@tanstack/react-query").UseQueryResult<MfaStatus, AxiosError<ApiError, any>>;
/**
 * 获取 MFA 方法列表
 */
export declare function useMfaMethods(): import("@tanstack/react-query").UseQueryResult<MfaMethod[], AxiosError<ApiError, any>>;
/**
 * 初始化 TOTP 设置
 */
export declare function useTotpSetup(): import("@tanstack/react-query").UseMutationResult<TotpSetupResponse, AxiosError<ApiError, any>, {
    sessionId: string;
}, unknown>;
/**
 * 绑定 TOTP (验证码确认)
 */
export declare function useTotpBind(): import("@tanstack/react-query").UseMutationResult<{
    success: boolean;
}, AxiosError<ApiError, any>, TotpBindRequest & {
    sessionId: string;
}, unknown>;
/**
 * 验证 MFA (登录流程)
 */
export declare function useMfaVerify(): import("@tanstack/react-query").UseMutationResult<MfaVerifyResponse, AxiosError<ApiError, any>, MfaVerifyRequest & {
    sessionId: string;
}, unknown>;
/**
 * 设置主要 MFA 方法
 */
export declare function useSetPrimaryMfa(): import("@tanstack/react-query").UseMutationResult<void, AxiosError<ApiError, any>, {
    mfaId: string;
}, unknown>;
/**
 * 禁用 MFA 方法
 */
export declare function useDisableMfa(): import("@tanstack/react-query").UseMutationResult<void, AxiosError<ApiError, any>, {
    mfaId: string;
}, unknown>;
/**
 * 删除 MFA 方法
 */
export declare function useDeleteMfa(): import("@tanstack/react-query").UseMutationResult<void, AxiosError<ApiError, any>, {
    mfaId: string;
}, unknown>;
/**
 * 重新生成备用码
 */
export declare function useRegenerateBackupCodes(): import("@tanstack/react-query").UseMutationResult<{
    backup_codes: string[];
}, AxiosError<ApiError, any>, {
    currentCode: string;
}, unknown>;
/**
 * 获取 Passkey 注册选项
 */
export declare function usePasskeyRegistrationOptions(): import("@tanstack/react-query").UseMutationResult<PasskeyRegistrationOptions, AxiosError<ApiError, any>, {
    sessionId: string;
}, unknown>;
/**
 * 完成 Passkey 注册
 */
export declare function usePasskeyRegistrationComplete(): import("@tanstack/react-query").UseMutationResult<{
    success: boolean;
}, AxiosError<ApiError, any>, {
    sessionId: string;
    credential: object;
}, unknown>;
/**
 * 获取 Passkey 认证选项
 */
export declare function usePasskeyAuthenticationOptions(): import("@tanstack/react-query").UseMutationResult<PasskeyAuthenticationOptions, AxiosError<ApiError, any>, {
    sessionId: string;
}, unknown>;
/**
 * 完成 Passkey 认证
 */
export declare function usePasskeyAuthenticationVerify(): import("@tanstack/react-query").UseMutationResult<MfaVerifyResponse, AxiosError<ApiError, any>, {
    sessionId: string;
    credential: object;
}, unknown>;
//# sourceMappingURL=mfa.d.ts.map