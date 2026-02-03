import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RoutingStrategiesPage } from '../../../features/channels/pages/RoutingStrategiesPage';
import type { RoutingStrategy } from '../../../features/channels/types/domain';
import { getRoutingStrategies } from '../../../features/channels/api/adapter';

export const Route = createFileRoute('/_authenticated/channels/strategy')({
  component: ChannelsStrategyRoute,
});

function ChannelsStrategyRoute() {
  const [data, setData] = useState<RoutingStrategy[]>([]);

  useEffect(() => {
    void getRoutingStrategies().then(setData);
  }, []);

  return <RoutingStrategiesPage data={data} />;
}
