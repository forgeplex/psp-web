'use client';

import React from 'react';
import { Table, Tag, Badge } from 'antd';

interface Props {
  channelId: string;
}

const mockHistory = [
  {
    id: 'test_001',
    created_at: '2026-02-03 14:30:25',
    result: 'success',
    response_ms: 245,
    environment: 'production',
    error_message: null,
  },
  {
    id: 'test_002',
    created_at: '2026-02-03 10:15:10',
    result: 'success',
    response_ms: 238,
    environment: 'production',
    error_message: null,
  },
  {
    id: 'test_003',
    created_at: '2026-02-02 16:45:30',
    result: 'failed',
    response_ms: 5000,
    environment: 'sandbox',
    error_message: 'Connection timeout',
  },
];

export default function TestHistoryTable({ channelId }: Props) {
  const columns = [
    {
      title: '测试时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      render: (env: string) => (
        <Tag color={env === 'production' ? 'red' : 'blue'}>
          {env === 'production' ? '生产环境' : '沙盒环境'}
        </Tag>
      ),
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      render: (result: string) => (
        <Badge
          status={result === 'success' ? 'success' : 'error'}
          text={result === 'success' ? '成功' : '失败'}
        />
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'response_ms',
      key: 'response_ms',
      render: (ms: number, record: any) =>
        record.result === 'success' ? `${ms}ms` : '-',
    },
    {
      title: '错误信息',
      dataIndex: 'error_message',
      key: 'error_message',
      render: (error: string | null) => error || '-',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={mockHistory}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
