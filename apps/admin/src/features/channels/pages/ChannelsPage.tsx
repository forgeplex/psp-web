import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Badge,
  Dropdown,
  Progress,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  message,
  Modal,
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ExperimentOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import type { Channel, ChannelStatus } from '../types/domain';
import { useChannels, useUpdateChannel, useDeleteChannel } from '../hooks';
import { channelStatusMap, healthStatusMap } from '../../../app/channels/status-maps';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// 提供商标签颜色
const providerColors: Record<string, string> = {
  stripe: 'blue',
  adyen: 'purple',
  pix: 'green',
  spei: 'orange',
  upi: 'cyan',
};

export function ChannelsPage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChannelStatus | 'all'>('all');

  const { data: channelsData, isLoading, refetch } = useChannels({
    keyword: searchKeyword || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  const channels = channelsData?.items || [];

  // 统计
  const activeCount = channels.filter(c => c.status === 'active').length;
  const healthyCount = channels.filter(c => c.health_status === 'healthy').length;
  const degradedCount = channels.filter(c => c.health_status === 'degraded').length;
  const failedCount = channels.filter(c => c.health_status === 'failed');

  const handleToggleStatus = async (channel: Channel) => {
    const newStatus = channel.status === 'active' ? 'inactive' : 'active';
    try {
      await updateChannel.mutateAsync({
        id: channel.id,
        payload: { status: newStatus },
      });
      message.success(`渠道已${newStatus === 'active' ? '启用' : '禁用'}`);
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = (channel: Channel) => {
    confirm({
      title: '确认删除渠道？',
      content: `即将删除渠道：${channel.name}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        try {
          await deleteChannel.mutateAsync(channel.id);
          message.success('删除成功');
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Channel) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.code}</Text>
        </Space>
      ),
    },
    {
      title: '提供商',
      dataIndex: 'provider_id',
      key: 'provider',
      render: (provider: string) => (
        <Tag color={providerColors[provider] || 'default'}>{provider}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ChannelStatus) => {
        const config = channelStatusMap[status];
        return <Badge status={config.badge as any} text={config.text} />;
      },
    },
    {
      title: '健康状态',
      dataIndex: 'health_status',
      key: 'health_status',
      render: (status: string) => {
        const config = healthStatusMap[status as keyof typeof healthStatusMap];
        return (
          <Space>
            <span>{config?.icon}</span>
            <Tag color={config?.color}>{config?.text}</Tag>
          </Space>
        );
      },
    },
    {
      title: '成功率',
      dataIndex: 'success_rate',
      key: 'success_rate',
      render: (rate: number) => (
        rate ? (
          <Tooltip title={`${rate.toFixed(1)}%`}>
            <Progress
              percent={Number(rate.toFixed(1))}
              size="small"
              style={{ width: 80 }}
              status={rate >= 95 ? 'success' : rate >= 90 ? 'normal' : 'exception'}
            />
          </Tooltip>
        ) : '-'
      ),
    },
    {
      title: '平均响应',
      dataIndex: 'avg_response_ms',
      key: 'avg_response_ms',
      render: (ms: number) => (
        ms ? (
          <Text style={{ color: ms < 300 ? '#52c41a' : ms < 1000 ? '#faad14' : '#ff4d4f' }}>
            {ms}ms
          </Text>
        ) : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: Channel) => {
        const items = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: '查看详情',
            onClick: () => navigate({ to: '/channels/detail/$id', params: { id: record.id } }),
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: '编辑',
            onClick: () => navigate({ to: '/channels/edit/$id', params: { id: record.id } }),
          },
          {
            key: 'toggle',
            icon: record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />,
            label: record.status === 'active' ? '禁用' : '启用',
            onClick: () => handleToggleStatus(record),
          },
          {
            key: 'test',
            icon: <ExperimentOutlined />,
            label: '健康检测',
            onClick: () => message.info('健康检测功能开发中'),
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <EditOutlined />,
            label: '删除',
            danger: true,
            onClick: () => handleDelete(record),
          },
        ];
        return (
          <Dropdown menu={{ items }} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            渠道管理
          </Title>
          <Text type="secondary">管理支付渠道配置、监控渠道健康状态</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate({ to: '/channels/create' })}
          >
            新建渠道
          </Button>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总渠道数"
              value={channels.length}
              suffix="个"
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已启用"
              value={activeCount}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="健康渠道"
              value={healthyCount}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="异常/维护"
              value={degradedCount + failedCount.length}
              suffix="个"
              valueStyle={{ color: degradedCount + failedCount.length > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Input
            placeholder="搜索渠道名称/代码"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="状态筛选"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="active">已启用</Option>
            <Option value="inactive">已禁用</Option>
            <Option value="maintenance">维护中</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            刷新
          </Button>
        </Space>
      </Card>

      {/* 渠道列表 */}
      <Card
        title="渠道列表"
        extra={
          <Space>
            <Button>导出数据</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={channels}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
}
