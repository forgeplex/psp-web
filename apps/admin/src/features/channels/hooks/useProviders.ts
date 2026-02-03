import { useQuery } from '@tanstack/react-query';
import type { Provider } from '../types/domain';

const PROVIDERS_QUERY_KEY = 'providers';

// Mock data - replace with real API when BE ready
const mockProviders: Provider[] = [
  {
    id: 'prov_wechat',
    code: 'WECHAT_PAY',
    name: '微信支付',
    status: 'active',
    description: '腾讯微信支付官方渠道',
  },
  {
    id: 'prov_alipay',
    code: 'ALIPAY',
    name: '支付宝',
    status: 'active',
    description: '蚂蚁金服支付宝官方渠道',
  },
  {
    id: 'prov_paypal',
    code: 'PAYPAL',
    name: 'PayPal',
    status: 'active',
    description: 'PayPal 国际支付',
  },
];

// API functions (mock mode)
async function listProviders(): Promise<Provider[]> {
  return mockProviders;
}

async function getProvider(id: string): Promise<Provider | undefined> {
  return mockProviders.find(p => p.id === id);
}

// Hooks
export function useProviders() {
  return useQuery({
    queryKey: [PROVIDERS_QUERY_KEY],
    queryFn: listProviders,
  });
}

export function useProvider(id: string | undefined) {
  return useQuery({
    queryKey: [PROVIDERS_QUERY_KEY, 'detail', id],
    queryFn: () => getProvider(id!),
    enabled: !!id,
  });
}
