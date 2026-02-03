import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ChannelsPage } from '../../features/channels/pages/ChannelsPage';
import type { Channel } from '../../features/channels/types/domain';
import { getChannels } from '../../features/channels/api/adapter';

export const Route = createFileRoute('/_authenticated/channels')({
  component: ChannelsRoute,
});

function ChannelsRoute() {
  const [data, setData] = useState<Channel[]>([]);

  useEffect(() => {
    void getChannels().then(setData);
  }, []);

  return <ChannelsPage data={data} />;
}
