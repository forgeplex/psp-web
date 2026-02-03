import React from 'react';
import type { Channel } from '../types/domain';
import { ChannelsPage } from './ChannelsPage';

interface ProviderChannelsPageProps {
  providerName?: string;
  data: Channel[];
}

export function ProviderChannelsPage({ providerName, data }: ProviderChannelsPageProps) {
  return <ChannelsPage title={`Provider Channels${providerName ? ` · ${providerName}` : ''}`} data={data} />;
}
