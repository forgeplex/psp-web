import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { HealthChecksPage } from '../../../features/channels/pages/HealthChecksPage';
import type { HealthCheck } from '../../../features/channels/types/domain';
import { getHealthChecks } from '../../../features/channels/api/adapter';

export const Route = createFileRoute('/_authenticated/channels/health')({
  component: ChannelsHealthRoute,
});

function ChannelsHealthRoute() {
  const [data, setData] = useState<HealthCheck[]>([]);

  useEffect(() => {
    void getHealthChecks().then(setData);
  }, []);

  return <HealthChecksPage data={data} />;
}
