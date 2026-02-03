import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ProviderChannelsPage } from '../../features/channels/pages/ProviderChannelsPage';
import type { Channel } from '../../features/channels/types/domain';
import { getChannelsByProvider } from '../../features/channels/api/adapter';

export const Route = createFileRoute('/_authenticated/providers/$providerId/channels')({
  component: ProviderChannelsRoute,
});

function ProviderChannelsRoute() {
  const { providerId } = Route.useParams();
  const [data, setData] = useState<Channel[]>([]);

  useEffect(() => {
    void getChannelsByProvider(providerId).then(setData);
  }, [providerId]);

  return <ProviderChannelsPage data={data} />;
}
