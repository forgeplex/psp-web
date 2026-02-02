/**
 * Merchant Module Types
 * Based on UIUX prototypes and API design
 */

// ============================================================
// Merchant Types
// ============================================================

export type MerchantStatus = 'pending' | 'active' | 'suspended' | 'closed' | 'rejected';
export type MerchantType = 'company' | 'individual';
export type KybStatus = 'pending' | 'in_review' | 'verified' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Merchant {
  id: string;
  code: string;
  name: string;
  legalName: string;
  type: MerchantType;
  status: MerchantStatus;
  kybStatus: KybStatus;
  riskLevel: RiskLevel;
  email: string;
  phone?: string;
  website?: string;
  mcc?: string;
  industry?: string;
  businessModel?: string;
  country: string;
  address?: string;
  createdAt: string;
  activatedAt?: string;
}

export interface MerchantBalance {
  currency: string;
  available: number;
  pending: number;
  frozen: number;
  settled: number;
}

export interface MerchantStats {
  totalTransactions: number;
  totalAmount: number;
  activeAccounts: number;
  activeUsers: number;
}

// ============================================================
// Account Types
// ============================================================

export type AccountStatus = 'active' | 'frozen' | 'closed';
export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';

export interface MerchantAccount {
  id: string;
  code: string;
  currency: string;
  bankName: string;
  accountNumber: string;
  pixKeyType?: PixKeyType;
  pixKey?: string;
  status: AccountStatus;
  isDefault: boolean;
  createdAt: string;
}

// ============================================================
// User Types
// ============================================================

export type UserRole = 'owner' | 'admin' | 'operator' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'locked';

export interface MerchantUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// ============================================================
// API Key Types
// ============================================================

export type ApiKeyEnvironment = 'sandbox' | 'production';
export type ApiKeyStatus = 'active' | 'revoked' | 'expired';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  environment: ApiKeyEnvironment;
  status: ApiKeyStatus;
  permissions: string[];
  ipWhitelist: string[];
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}

// ============================================================
// IP Whitelist Types
// ============================================================

export interface IpWhitelistEntry {
  id: string;
  ip: string;
  description?: string;
  status: 'active' | 'disabled';
  createdAt: string;
  createdBy: string;
}

// ============================================================
// Status Log Types
// ============================================================

export interface StatusLog {
  id: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  reason?: string;
  operator: string;
  createdAt: string;
}

// ============================================================
// Form Types
// ============================================================

export interface CreateMerchantForm {
  code: string;
  name: string;
  legalName: string;
  type: MerchantType;
  email: string;
  country: string;
  phone?: string;
  mcc?: string;
  industry?: string;
  website?: string;
}

export interface StatusChangeForm {
  targetStatus: MerchantStatus;
  reason?: string;
}
