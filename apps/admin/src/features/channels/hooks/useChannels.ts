import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChannels,
  getChannelDetail,
  createChannel,
  updateChannel,
  deleteChannel,
  toggleChannel,
} from '../api/adapter';
import type {
  Channel,
  ListChannelsParams,
  CreateChannelRequest,
  UpdateChannelRequest,
  ToggleChannelRequest,
} from '@psp/shared';

const CHANNELS_KEY = 'channels';

export function useChannels(params?: ListChannelsParams) {
  return useQuery({
    queryKey: [CHANNELS_KEY, params],
    queryFn: () => getChannels(params),
  });
}

export function useChannelDetail(id: string) {
  return useQuery({
    queryKey: [CHANNELS_KEY, id],
    queryFn: () => getChannelDetail(id),
    enabled: !!id,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_KEY] });
    },
  });
}

export function useUpdateChannel(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateChannelRequest) => updateChannel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CHANNELS_KEY] });
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_KEY] });
    },
  });
}

export function useToggleChannel(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ToggleChannelRequest) => toggleChannel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHANNELS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CHANNELS_KEY] });
    },
  });
}
