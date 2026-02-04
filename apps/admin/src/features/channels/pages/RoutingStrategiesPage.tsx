import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Badge,
  Switch,
  Typography,
  Row,
  Col,
  Tooltip,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd';
import {
  PlusOutlined,
  DragOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import type { RoutingStrategy, ReorderStrategiesRequest } from '../types/domain';
import {
  useRoutingStrategies,
  useUpdateRoutingStrategy,
  useDeleteRoutingStrategy,
  useReorderRoutingStrategies,
} from '../hooks';

const { Title, Text } = Typography;
const { Option } = Select;

// 条件标签渲染
const ConditionTag = ({ type, value }: { type: string; value: any }) => {
  const config: Record<string, { color: string; label: string }> = {
    amount_min: { color: 'green', label: '金额≥' },
    amount_max: { color: 'green', label: '金额≤' },
    currency: { color: 'blue', label: '币种' },
    country: { color: 'purple', label: '国家' },
    merchant_id: { color: 'orange', label: '商户' },
  };
  const c = config[type] || { color: 'default', label: type };
  return (
    <Tag color={c.color} style={{ marginBottom: 4 }}>
      {c.label}: {Array.isArray(value) ? value.join(', ') : value}
    </Tag>
  );
};

export function RoutingStrategiesPage() {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<RoutingStrategy | null>(null);
  const [form] = Form.useForm();

  const { data: strategies, isLoading, refetch } = useRoutingStrategies();
  const updateStrategy = useUpdateRoutingStrategy();
  const deleteStrategy = useDeleteRoutingStrategy();
  const reorderStrategies = useReorderRoutingStrategies();

  const sortedStrategies = [...(strategies || [])].sort((a, b) => a.priority - b.priority);

  // 移动策略（使用 reorder API 批量更新优先级）- v1.0 Reorder API
  // POST /routing-strategies/reorder
  // Body: { orders: [{ id, priority }, ...] }
  const handleMove = async (sourceId: string, direction: 'up' | 'down') => {
    const idx = sortedStrategies.findIndex(s => s.id === sourceId);
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sortedStrategies.length) return;

    // Build reorder request: swap priorities between source and target
    const sourceStrategy = sortedStrategies[idx];
    const targetStrategy = sortedStrategies[targetIdx];
    
    const orders: ReorderStrategiesRequest['orders'] = sortedStrategies.map((s, i) => {
      if (s.id === sourceId) {
        return { id: s.id, priority: targetStrategy.priority };
      }
      if (s.id === targetStrategy.id) {
        return { id: s.id, priority: sourceStrategy.priority };
      }
      return { id: s.id, priority: s.priority };
    });

    try {
      await reorderStrategies.mutateAsync({ orders });
      message.success('优先级已调整');
    } catch {
      message.error('调整失败');
    }
  };

  const handleToggleStatus = async (strategy: RoutingStrategy) => {
    try {
      await updateStrategy.mutateAsync({
        id: strategy.id,
        payload: { enabled: !strategy.enabled },
      });
      message.success(`策略已${!strategy.enabled ? '启用' : '禁用'}`);
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (strategy: RoutingStrategy) => {
    try {
      await deleteStrategy.mutateAsync(strategy.id);
      message.success('删除成功');
    } catch {
      message.error('删除失败');
    }
  };

  const handleEdit = (strategy: RoutingStrategy) => {
    setEditingStrategy(strategy);
    form.setFieldsValue({
      name: strategy.name,
      priority: strategy.priority,
      enabled: strategy.enabled,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (values: any) => {
    if (!editingStrategy) return;
    try {
      await updateStrategy.mutateAsync({
        id: editingStrategy.id,
        payload: values,
      });
      message.success('更新成功');
      setIsEditModalOpen(false);
    } catch {
      message.error('更新失败');
    }
  };

  const columns = [
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: number) => (
        <Badge
          count={priority}
          style={{
            backgroundColor: priority <= 3 ? '#1677ff' : '#d9d9d9',
          }}
        />
      ),
    },
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: RoutingStrategy) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
          )}
        </Space>
      ),
    },
    {
      title: '匹配条件',
      dataIndex: 'conditions',
      key: 'conditions',
      render: (conditions: Record<string, any>) => (
        <div>
          {conditions && Object.entries(conditions).map(([key, value]) => (
            <ConditionTag key={key} type={key} value={value} />
          ))}
        </div>
      ),
    },
    {
      title: '目标渠道',
      dataIndex: 'target_channels',
      key: 'target_channels',
      render: (channels: string[]) => (
        <Space wrap>
          {channels?.map(ch => (
            <Tag key={ch}>{ch}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record: RoutingStrategy) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggleStatus(record)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: RoutingStrategy, index: number) => (
        <Space>
          <Tooltip title="上移">
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              disabled={index === 0}
              onClick={() => handleMove(record.id, 'up')}
            />
          </Tooltip>
          <Tooltip title="下移">
            <Button
              type="text"
              icon={<ArrowDownOutlined />}
              disabled={index === sortedStrategies.length - 1}
              onClick={() => handleMove(record.id, 'down')}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            路由策略
          </Title>
          <Text type="secondary">配置支付路由策略，优先级数字越小越优先匹配</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate({ to: '/channels/strategy/create' })}
          >
            新建策略
          </Button>
        </Col>
      </Row>

      {/* 策略列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={sortedStrategies}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          bordered
          title={() => (
            <Space>
              <DragOutlined />
              <Text strong>策略优先级列表</Text>
              <Text type="secondary" style={{ marginLeft: 16 }}>
                使用上下箭头调整优先级（交换位置）
              </Text>
            </Space>
          )}
        />
      </Card>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑策略"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveEdit}>
          <Form.Item
            name="name"
            label="策略名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
