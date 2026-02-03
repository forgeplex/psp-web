// Domain models for Channels module
// TODO(openapi): reconcile with generated types once v0.9 spec is available

import type { ProviderStub } from './stub/providers';
import type { ChannelStub, ChannelConfigStub } from './stub/channels';
import type { RoutingStrategyStub, RoutingStrategyTargetStub } from './stub/routing';
import type { HealthCheckStub } from './stub/health';
import type { ChannelConfigMatrixStub, RoutingRuleSpecStub } from './stub';

export interface Provider extends ProviderStub {}
export interface Channel extends ChannelStub {}
export interface ChannelConfig extends ChannelConfigStub {}
export interface RoutingStrategy extends RoutingStrategyStub {}
export interface RoutingStrategyTarget extends RoutingStrategyTargetStub {}
export interface HealthCheck extends HealthCheckStub {}
export interface ChannelConfigMatrix extends ChannelConfigMatrixStub {}
export interface RoutingRuleSpec extends RoutingRuleSpecStub {}
