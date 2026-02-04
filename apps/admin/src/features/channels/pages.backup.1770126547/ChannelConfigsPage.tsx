import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import { PageHeader } from '@psp/ui';
import type { ChannelConfigMatrix } from '../types/domain';
import type { ChannelConfigFieldStub } from '../types/stub/channel-configs';
import { getChannelConfigMatrices } from '../api/adapter';

interface ChannelConfigRow extends ChannelConfigFieldStub {
  channel_id: string;
  channel_name: string;
  confirm_required: boolean;
  audit_required: boolean;
  updated_at: string;
}

const booleanTag = (value: boolean, label: string) => (
  <Tag color={value ? 'green' : 'default'}>{label}</Tag>
);

export function ChannelConfigsPage() {
  const [data, setData] = useState<ChannelConfigMatrix[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getChannelConfigMatrices()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo<ChannelConfigRow[]>(
    () =>
      data.flatMap((matrix) =>
        matrix.fields.map((field) => ({
          ...field,
          channel_id: matrix.channel_id,
          channel_name: matrix.channel_name,
          confirm_required: matrix.confirm_required,
          audit_required: matrix.audit_required,
          updated_at: matrix.updated_at,
        })),
      ),
    [data],
  );

  return (
    <div>
      <PageHeader title="Channel Configs" subtitle="配置字段矩阵（stub）" />
      <Card style={{ borderRadius: 8 }}>
        <Table
          rowKey={(record) => `${record.channel_id}-${record.key}`}
          loading={loading}
          dataSource={rows}
          columns={[
            { title: 'Channel', dataIndex: 'channel_name', key: 'channel_name' },
            { title: '字段', dataIndex: 'label', key: 'label' },
            { title: 'Key', dataIndex: 'key', key: 'key' },
            { title: '类型', dataIndex: 'type', key: 'type' },
            {
              title: '必填',
              dataIndex: 'required',
              key: 'required',
              render: (value: boolean) => booleanTag(value, value ? '是' : '否'),
            },
            {
              title: '掩码',
              dataIndex: 'masked',
              key: 'masked',
              render: (value: boolean) => booleanTag(value, value ? 'Mask' : 'No'),
            },
            {
              title: 'W-only',
              dataIndex: 'write_only',
              key: 'write_only',
              render: (value: boolean) => booleanTag(value, value ? 'Write' : 'Read'),
            },
            { title: 'PATCH', dataIndex: 'patch_strategy', key: 'patch_strategy' },
            {
              title: '确认',
              dataIndex: 'confirm_required',
              key: 'confirm_required',
              render: (value: boolean) => booleanTag(value, value ? '需要' : '无需'),
            },
            {
              title: '审计',
              dataIndex: 'audit_required',
              key: 'audit_required',
              render: (value: boolean) => booleanTag(value, value ? '需要' : '无需'),
            },
          ]}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <Typography.Text type="secondary">
                {record.description || '暂无描述'}
              </Typography.Text>
            ),
            rowExpandable: (record) => Boolean(record.description),
          }}
        />
      </Card>
    </div>
  );
}
