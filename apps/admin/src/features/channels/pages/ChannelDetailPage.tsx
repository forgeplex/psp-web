import React from 'react';
import { Card, Tabs, Typography } from 'antd';
import { PageHeader } from '@psp/ui';
import type { Channel } from '../types/domain';

interface ChannelDetailPageProps {
  channel?: Channel;
}

export function ChannelDetailPage({ channel }: ChannelDetailPageProps) {
  return (
    <div>
      <PageHeader title={channel ? `Channel · ${channel.name}` : 'Channel Detail'} />
      <Card style={{ borderRadius: 8 }}>
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
