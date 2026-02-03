import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ProviderChannelsPage } from '../../features/channels/pages/ProviderChannelsPage';

export const Route = createFileRoute('/_authenticated/providers/$providerId/channels')({
  component: ProviderChannelsRoute,
});

function ProviderChannelsRoute() {
  const { providerId } = Route.useParams();
  return <ProviderChannelsPage providerId={providerId} />;
}
