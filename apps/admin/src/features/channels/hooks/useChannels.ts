import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ListChannelsParams, CreateChannelRequest, UpdateChannelRequest, ToggleChannelRequest } from '@psp/shared';
import {
  getChannels,
  getChannelDetail,
  createChannel,
  updateChannel,
  toggleChannel,
} from '../api/adapter';

// Query keys
export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (params: ListChannelsParams) => [...channelKeys.lists(), params] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
};

// ==================== Queries ====================

/**
 * 获取渠道列表
 */
export function useChannels(params: ListChannelsParams = {}) {
  return useQuery({
    queryKey: channelKeys.list(params),
    queryFn: () => getChannels(params),
  });
}

/**
 * 获取渠道详情
 */
export function useChannel(id: string) {
  return useQuery({
    queryKey: channelKeys.detail(id),
    queryFn: () => getChannelDetail(id),
    enabled: !!id,
  });
}

// ==================== Mutations ====================

/**
 * 创建渠道
 */
export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChannelRequest) => createChannel(data),
    onSuccess: () => {
      message.success('渠道创建成功');
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
    },
    onError: () => {
      message.error('渠道创建失败');
    },
  });
}

/**
 * 更新渠道
 */
export function useUpdateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateChannelRequest }) =>
      updateChannel(id, payload),
    onSuccess: (_, { id }) => {
      message.success('渠道更新成功');
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
    },
    onError: () => {
      message.error('渠道更新失败');
    },
  });
}

/**
 * 设置渠道状态
 */
export function useSetChannelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ToggleChannelRequest['status'] }) =>
      toggleChannel(id, { status }),
    onSuccess: (_, { id }) => {
      message.success('状态更新成功');
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
    },
    onError: () => {
      message.error('状态更新失败');
    },
  });
}
