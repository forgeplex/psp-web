import React from 'react';
import { Card, Descriptions, Tabs, Tag, Typography } from 'antd';
import { PageHeader } from '@psp/ui';
import type { Channel } from '../types/domain';

interface ChannelDetailPageProps {
  channel?: Channel;
}

export function ChannelDetailPage({ channel }: ChannelDetailPageProps) {
  const statusColor: Record<string, string> = {
    active: 'green',
    inactive: 'default',
    maintenance: 'orange',
  };

  const healthColor: Record<string, string> = {
    healthy: 'green',
    degraded: 'orange',
    failed: 'red',
    unknown: 'default',
  };

  return (
    <div>
      <PageHeader title={channel ? `Channel · ${channel.name}` : 'Channel Detail'} />
      <Card style={{ borderRadius: 8 }}>
        <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
          <Descriptions.Item label="名称">{channel?.name ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Code">{channel?.code ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="Provider">{channel?.provider_id ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="类型">{channel?.type ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={channel ? statusColor[channel.status] : 'default'}>
              {channel?.status ?? '-'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="健康度">
            <Tag color={channel ? healthColor[channel.health_status] : 'default'}>
              {channel?.health_status ?? '-'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="优先级">{channel?.priority ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{channel?.created_at ?? '-'}</Descriptions.Item>
        </Descriptions>
        <Tabs
          items={[
            {
              key: 'config',
              label: '配置',
              children: (
                <Typography.Text type="secondary">
                  TODO(openapi): channel_configs 掩码/编辑/patch 语义
                </Typography.Text>
              ),
            },
            {
              key: 'routing',
              label: '路由',
              children: (
                <Typography.Text type="secondary">
                  TODO(openapi): routing rules JSON schema + 校验
                </Typography.Text>
              ),
            },
            {
              key: 'health',
              label: '健康检查',
              children: (
                <Typography.Text type="secondary">
                  TODO(openapi): health_checks 列表/详情
                </Typography.Text>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
