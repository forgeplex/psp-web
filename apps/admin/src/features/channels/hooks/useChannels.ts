/**
 * React Query hooks for Channels API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listChannels,
  getChannel,
  enableChannel,
  disableChannel,
  verifyChannel,
  getChannelHealth,
  type ListChannelsParams,
  type ChannelResponse,
} from '@psp/api';

// Query keys
export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (params?: ListChannelsParams) => [...channelKeys.lists(), params] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  health: (id: string) => [...channelKeys.all, 'health', id] as const,
};

/**
 * Fetch paginated list of channels
 */
export function useChannelList(params?: ListChannelsParams) {
  return useQuery({
    queryKey: channelKeys.list(params),
    queryFn: () => listChannels(params),
  });
}

/**
 * Fetch single channel by ID
 */
export function useChannel(channelId: string) {
  return useQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: () => getChannel(channelId),
    enabled: !!channelId,
  });
}

/**
 * Fetch channel health
 */
export function useChannelHealth(channelId: string) {
  return useQuery({
    queryKey: channelKeys.health(channelId),
    queryFn: () => getChannelHealth(channelId),
    enabled: !!channelId,
    refetchInterval: 30_000, // Refresh every 30s
  });
}

/**
 * Enable channel mutation
 */
export function useEnableChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => enableChannel(channelId),
    onSuccess: (data, channelId) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      queryClient.setQueryData(channelKeys.detail(channelId), data);
    },
  });
}

/**
 * Disable channel mutation
 */
export function useDisableChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => disableChannel(channelId),
    onSuccess: (data, channelId) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
      queryClient.setQueryData(channelKeys.detail(channelId), data);
    },
  });
}

/**
 * Verify channel mutation
 */
export function useVerifyChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, options }: { channelId: string; options?: Parameters<typeof verifyChannel>[1] }) =>
      verifyChannel(channelId, options),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.health(channelId) });
    },
  });
}
