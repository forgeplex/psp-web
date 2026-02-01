/**
 * API Type Definitions
 *
 * TODO: Auto-generate from OpenAPI spec.
 * These are placeholder types that match the expected API shape.
 */

// ─── Common ──────────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// ─── Merchant ────────────────────────────────────────────────

export interface Merchant extends BaseEntity {
  name: string;
  code: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  balance: number;
}

// ─── Transaction ─────────────────────────────────────────────

export interface Transaction extends BaseEntity {
  orderNo: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  channelName: string;
  completedAt?: string;
}

// ─── Channel ─────────────────────────────────────────────────

export interface Channel extends BaseEntity {
  name: string;
  code: string;
  provider: string;
  status: string;
  successRate: number;
  avgResponseTime: number;
}

// ─── Dashboard ───────────────────────────────────────────────

export interface DashboardStats {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  activeMerchants: number;
  transactionsTrend: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  value: number;
}
