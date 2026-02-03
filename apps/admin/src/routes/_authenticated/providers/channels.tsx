import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ChannelsPage } from '../../../features/channels/pages/ChannelsPage';

export const Route = createFileRoute('/_authenticated/providers/channels')({
  component: ProvidersChannelsRoute,
});

function ProvidersChannelsRoute() {
  return <ChannelsPage title="Provider Channels" />;
}
