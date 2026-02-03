import React from 'react';
import { Timeline as AntTimeline, Card, Tag, Space, Typography } from 'antd';
import { 
  CheckCircleFilled, 
  ClockCircleFilled, 
  CloseCircleFilled,
  SyncOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyOutlined,
  IssuesCloseOutlined,
  LoadingOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import type { TimelineNode } from '../types';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface TransactionTimelineProps {
  nodes: TimelineNode[];
  loading?: boolean;
}

/**
 * 状态图标映射
 */
const getStatusIcon = (status: string, completed: boolean, current: boolean) => {
  const iconStyle = { fontSize: 16 };
  
  if (current) {
    return <LoadingOutlined style={{ ...iconStyle, color: '#1677ff' }} />;
  }
  
  if (!completed) {
    return <ClockCircleFilled style={{ ...iconStyle, color: '#bfbfbf' }} />;
  }
  
  switch (status) {
    case 'created':
      return <FileTextOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
    case 'pending':
      return <ClockCircleFilled style={{ ...iconStyle, color: '#faad14' }} />;
    case 'risk_checking':
      return <SafetyOutlined style={{ ...iconStyle, color: '#1677ff' }} />;
    case 'risk_approved':
      return <SafetyOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
    case 'processing':
      return <SyncOutlined style={{ ...iconStyle, color: '#1677ff' }} />;
    case 'paid':
      return <DollarOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
    case 'completed':
      return <CheckCircleFilled style={{ ...iconStyle, color: '#52c41a' }} />;
    case 'failed':
      return <CloseCircleFilled style={{ ...iconStyle, color: '#ff4d4f' }} />;
    case 'cancelled':
      return <IssuesCloseOutlined style={{ ...iconStyle, color: '#8c8c8c' }} />;
    case 'refunded':
      return <DollarOutlined style={{ ...iconStyle, color: '#fa8c16' }} />;
    default:
      return <CheckCircleFilled style={{ ...iconStyle, color: '#52c41a' }} />;
  }
};

/**
 * 状态颜色映射
 */
const getStatusColor = (status: string, current: boolean): string => {
  if (current) return 'processing';
  
  switch (status) {
    case 'failed':
      return 'error';
    case 'cancelled':
      return 'default';
    case 'pending':
      return 'warning';
    case 'completed':
    case 'paid':
      return 'success';
    case 'refunded':
      return 'orange';
    default:
      return 'default';
  }
};

/**
 * Transaction Timeline Component
 * 
 * 基于 Ant Design v6 Timeline 组件
 * 符合 API Spec v1.2 数据结构 (TimelineNode)
 * 
 * @example
 * ```tsx
 * <TransactionTimeline 
 *   nodes={timelineData} 
 *   loading={isLoading} 
 * />
 * ```
 */
export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  nodes,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card title="交易时间线" loading={true}>
        <div style={{ minHeight: 200 }} />
      </Card>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <Card title="交易时间线">
        <Text type="secondary">暂无时间线数据</Text>
      </Card>
    );
  }

  const timelineItems = nodes.map((node) => {
    const icon = getStatusIcon(node.status, node.completed, node.current);
    
    return {
      key: node.status,
      dot: icon,
      color: node.current ? 'blue' : node.completed ? 'green' : 'gray',
      children: (
        <div style={{ 
          padding: '8px 0',
          opacity: node.completed || node.current ? 1 : 0.5 
        }}>
          <Space direction="vertical" size={4} style={{ display: 'flex' }}>
            {/* 状态标签 */}
            <Space>
              <Tag 
                color={getStatusColor(node.status, node.current)}
                style={{ fontSize: 14, padding: '4px 12px' }}
              >
                {node.label}
              </Tag>
              {node.current && (
                <Tag color="blue" icon={<LoadingOutlined />}>
                  当前状态
                </Tag>
              )}
            </Space>
            
            {/* 描述 */}
            {node.description && (
              <Paragraph 
                type="secondary" 
                style={{ margin: 0, fontSize: 13 }}
                ellipsis={{ rows: 2 }}
              >
                {node.description}
              </Paragraph>
            )}
            
            {/* 时间和操作人 */}
            <Space size={16} style={{ marginTop: 4 }}>
              {node.time && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(node.time).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              )}
              {node.operator && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  操作人: {node.operator}
                </Text>
              )}
            </Space>
          </Space>
        </div>
      ),
    };
  });

  return (
    <Card 
      title="交易时间线" 
      className="transaction-timeline-card"
      styles={{ body: { padding: '16px 24px' } }}
    >
      <AntTimeline
        mode="left"
        items={timelineItems}
      />
    </Card>
  );
};

export default TransactionTimeline;
