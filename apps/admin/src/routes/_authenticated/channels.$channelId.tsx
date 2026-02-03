import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ChannelDetailPage } from '../../features/channels/pages/ChannelDetailPage';
import type { Channel } from '../../features/channels/types/domain';
import { getChannelDetail } from '../../features/channels/api/adapter';

export const Route = createFileRoute('/_authenticated/channels/$channelId')({
  component: ChannelDetailRoute,
});

function ChannelDetailRoute() {
  const { channelId } = Route.useParams();
  const [channel, setChannel] = useState<Channel | undefined>();

  useEffect(() => {
    void getChannelDetail(channelId).then(setChannel);
  }, [channelId]);

  return <ChannelDetailPage channel={channel} />;
}
