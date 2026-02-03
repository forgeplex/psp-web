import { useQuery } from '@tanstack/react-query';
import { getProviders, getProviderDetail } from '../api/adapter';
import type { ListProvidersParams } from '@psp/shared';

const PROVIDERS_KEY = 'providers';

export function useProviders(params?: ListProvidersParams) {
  return useQuery({
    queryKey: [PROVIDERS_KEY, params],
    queryFn: () => getProviders(params),
  });
}

export function useProviderDetail(id: string) {
  return useQuery({
    queryKey: [PROVIDERS_KEY, id],
    queryFn: () => getProviderDetail(id),
    enabled: !!id,
  });
}
