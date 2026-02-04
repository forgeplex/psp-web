import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Channel, ChannelStatus, ChannelListResponse } from '../types/domain';
import { channelsApi } from '../api/realApi';

const CHANNELS_QUERY_KEY = 'channels';

// Types for API responses
interface ChannelListParams {
  providerId?: string;
  status?: ChannelStatus;
  keyword?: string;
  limit?: number;
  offset?: number;
}

// ChannelListResponse imported from domain.ts

// List channels with filters
export function useChannels(params: ChannelListParams = {}) {
  return useQuery<ChannelListResponse>({
    queryKey: [CHANNELS_QUERY_KEY, params],
    queryFn: () => channelsApi.list(params),
  });
}

// Get single channel detail
export function useChannel(channelId: string | undefined) {
  return useQuery<Channel>({
    queryKey: [CHANNELS_QUERY_KEY, 'detail', channelId],
    queryFn: () => channelsApi.get(channelId!),
    enabled: !!channelId,
  });
}

// Create channel
export function useCreateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: Partial<Channel>) => channelsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY] });
    },
  });
}

// Update channel
export function useUpdateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, payload }: { channelId: string; payload: Partial<Channel> }) =>
      channelsApi.update(channelId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY, 'detail', variables.channelId] });
    },
  });
}

// Toggle channel status (enable/disable)
export function useToggleChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, status }: { channelId: string; status: ChannelStatus }) =>
      channelsApi.setStatus(channelId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY, 'detail', variables.channelId] });
    },
  });
}

// Delete channel
export function useDeleteChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => channelsApi.delete(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_QUERY_KEY] });
    },
  });
}
