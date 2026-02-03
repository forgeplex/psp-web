import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ChannelsPage } from '../../../features/channels/pages/ChannelsPage';

export const Route = createFileRoute('/_authenticated/channels/')({
  component: ChannelsIndexRoute,
});

function ChannelsIndexRoute() {
  return <ChannelsPage />;
}
