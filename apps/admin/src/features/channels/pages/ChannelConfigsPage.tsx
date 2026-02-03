import React from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import { PageHeader } from '@psp/ui';
import type { Channel } from '../types/domain';
import { stubChannels } from '../data/stub';

interface ChannelConfigRow {
  channel_id: string;
  channel_name: string;
  config_key: string;
  config_value: string;
  updated_at: string;
}

const booleanTag = (value: boolean, label: string) => (
  <Tag color={value ? 'green' : 'default'}>{label}</Tag>
);

// Stub data for channel configs
const stubConfigRows: ChannelConfigRow[] = stubChannels.flatMap((channel) => [
  {
    channel_id: channel.id,
    channel_name: channel.name,
    config_key: 'api_endpoint',
    config_value: 'https://api.stripe.com/v1',
    updated_at: channel.updated_at,
  },
  {
    channel_id: channel.id,
    channel_name: channel.name,
    config_key: 'timeout_ms',
    config_value: '30000',
    updated_at: channel.updated_at,
  },
]);

interface ChannelConfigsPageProps {
  data?: Channel[];
}

export function ChannelConfigsPage({ data }: ChannelConfigsPageProps) {
  return (
    <div>
      <PageHeader title="Channel Configs" subtitle="渠道配置管理" />
      <Card style={{ borderRadius: 8 }}>
        <Table
          rowKey={(record) => `${record.channel_id}-${record.config_key}`}
          dataSource={stubConfigRows}
          columns={[
            { title: 'Channel', dataIndex: 'channel_name', key: 'channel_name' },
            { title: 'Config Key', dataIndex: 'config_key', key: 'config_key' },
            { title: 'Value', dataIndex: 'config_value', key: 'config_value' },
            { title: 'Updated', dataIndex: 'updated_at', key: 'updated_at' },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
}
