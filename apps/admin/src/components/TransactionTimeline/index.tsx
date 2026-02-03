import React from 'react';
import { Timeline as AntTimeline, Typography, Tag, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

export interface TimelineNode {
  status: string;
  label: string;
  description?: string;
  completed: boolean;
  current: boolean;
  time: string;
  operator?: string;
}

export interface TransactionTimelineProps {
  nodes: TimelineNode[];
  loading?: boolean;
}

const statusColorMap: Record<string, string> = {
  created: 'blue',
  pending: 'orange',
  processing: 'processing',
  paid: 'green',
  completed: 'success',
  failed: 'error',
  cancelled: 'default',
  refunded: 'purple',
};

const getStatusIcon = (node: TimelineNode) => {
  if (node.completed) {
    return <CheckCircleOutlined style={{ color: '#22C55E' }} />;
  }
  if (node.current) {
    return <ClockCircleOutlined style={{ color: brandColors.primary }} />;
  }
  return <CloseCircleOutlined style={{ color: '#94A3B8' }} />;
};

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  nodes,
  loading = false,
}) => {
  if (loading) {
    return <div>加载中...</div>;
  }

  const items = nodes.map((node, index) => ({
    key: index,
    dot: getStatusIcon(node),
    color: node.completed ? 'green' : node.current ? 'blue' : 'gray',
    children: (
      <Space direction="vertical" size={4} style={{ display: 'flex' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text strong style={{ fontSize: 14 }}>
            {node.label}
          </Typography.Text>
          <Tag color={statusColorMap[node.status] || 'default'}>
            {node.status}
          </Tag>
          {node.current && (
            <Tag color="processing" style={{ marginLeft: 8 }}>
              当前状态
            </Tag>
          )}
        </div>
        {node.description && (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {node.description}
          </Typography.Text>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {node.time}
          </Typography.Text>
          {node.operator && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              操作人: {node.operator}
            </Typography.Text>
          )}
        </div>
      </Space>
    ),
  }));

  return (
    <div style={{ padding: '16px 0' }}>
      <AntTimeline
        mode="left"
        items={items}
        style={{ paddingLeft: 8 }}
      />
    </div>
  );
};

export default TransactionTimeline;
