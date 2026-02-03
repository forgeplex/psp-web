import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ProvidersPage } from '../../../features/channels/pages/ProvidersPage';
import type { Provider } from '../../../features/channels/types/domain';
import { getProviders } from '../../../features/channels/api/adapter';

export const Route = createFileRoute('/_authenticated/providers/')({
  component: ProvidersIndexRoute,
});

function ProvidersIndexRoute() {
  const [data, setData] = useState<Provider[]>([]);

  useEffect(() => {
    void getProviders().then(setData);
  }, []);

  return <ProvidersPage data={data} />;
}
