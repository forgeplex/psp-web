import React from 'react';
import { ChannelsPage } from './ChannelsPage';

interface ProviderChannelsPageProps {
  providerId: string;
  providerName?: string;
}

export function ProviderChannelsPage({ providerId, providerName }: ProviderChannelsPageProps) {
  return (
    <ChannelsPage
      title={`Provider Channels${providerName ? ` · ${providerName}` : ''}`}
      providerId={providerId}
    />
  );
}
