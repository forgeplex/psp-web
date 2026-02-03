import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ChannelsPage } from '../../../features/channels/pages/ChannelsPage';
import type { Channel } from '../../../features/channels/types/domain';
// TODO: Switch to real API once backend is ready
import { getChannels } from '../../../features/channels/api/mockAdapter';

export const Route = createFileRoute('/_authenticated/channels/')({
  component: ChannelsIndexRoute,
});

function ChannelsIndexRoute() {
  const [data, setData] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getChannels()
      .then((res) => setData(res.items))
      .finally(() => setLoading(false));
  }, []);

  return <ChannelsPage data={data} loading={loading} />;
}
