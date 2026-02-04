'use client';

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

// 模拟策略数据
const mockStrategies = [
  {
    id: 'rs_001',
    name: '巴西大额优先',
    priority: 1,
    is_active: true,
    conditions: {
      amount_min: 5000,
      currency: ['BRL'],
      country: ['BR'],
    },
    target_channels: ['ch_abc123', 'ch_def456'],
    channel_weights: { ch_abc123: 70, ch_def456: 30 },
    updated_at: '2026-02-03 10:30',
  },
  {
    id: 'rs_002',
    name: '墨西哥标准路由',
    priority: 2,
    is_active: true,
    conditions: {
      amount_min: 100,
      amount_max: 5000,
      currency: ['MXN'],
      country: ['MX'],
    },
    target_channels: ['ch_def456'],
    channel_weights: { ch_def456: 100 },
    updated_at: '2026-02-02 15:20',
  },
  {
    id: 'rs_003',
    name: 'VIP商户专用',
    priority: 3,
    is_active: false,
    conditions: {
      merchant_id: ['mer_vip001', 'mer_vip002'],
    },
    target_channels: ['ch_abc123'],
    channel_weights: { ch_abc123: 100 },
    updated_at: '2026-02-01 09:00',
  },
  {
    id: 'rs_004',
    name: '小额快速通道',
    priority: 4,
    is_active: true,
    conditions: {
      amount_max: 100,
    },
    target_channels: ['ch_ghi789'],
    channel_weights: { ch_ghi789: 100 },
    updated_at: '2026-01-28 14:00',
  },
];

// 渠道名称映射
const channelNames: Record<string, string> = {
  ch_abc123: 'Stripe-Brazil',
  ch_def456: 'Adyen-Mexico',
  ch_ghi789: 'Pix-Local',
};

export default function RoutingStrategiesPage() {
  const [strategies, setStrategies] = useState(mockStrategies);
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<any>(null);
  const [form] = Form.useForm();

  // 启用/禁用策略
  const handleToggle = (id: string, checked: boolean) => {
    setStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: checked } : s))
    );
    message.success(`策略已${checked ? '启用' : '禁用'}`);
  };

  // 删除策略
  const handleDelete = (id: string) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
    message.success('策略已删除');
  };

  // 上移
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...strategies];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    // 重新计算优先级
    newList.forEach((s, i) => (s.priority = i + 1));
    setStrategies(newList);
    setHasChanges(true);
  };

  // 下移
  const handleMoveDown = (index: number) => {
    if (index === strategies.length - 1) return;
    const newList = [...strategies];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    newList.forEach((s, i) => (s.priority = i + 1));
    setStrategies(newList);
    setHasChanges(true);
  };

  // 保存排序
  const handleSaveOrder = () => {
    console.log('Save order:', strategies.map((s) => ({ id: s.id, priority: s.priority })));
    setHasChanges(false);
    message.success('排序已保存');
  };

  // 打开编辑/创建
  const handleOpenModal = (strategy?: any) => {
    setEditingStrategy(strategy || null);
    if (strategy) {
      form.setFieldsValue({
        name: strategy.name,
        conditions: Object.entries(strategy.conditions).map(([key, value]) => ({
          type: key,
          value: Array.isArray(value) ? value.join(',') : value,
        })),
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 提交表单
  const handleSubmit = (values: any) => {
    console.log('Submit:', values);
    setIsModalOpen(false);
    message.success(editingStrategy ? '策略已更新' : '策略已创建');
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
            backgroundColor: priority <= 3 ? '#52c41a' : '#d9d9d9',
            minWidth: 28,
            height: 28,
            lineHeight: '28px',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
      ),
    },
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.id}
          </Text>
        </Space>
      ),
    },
    {
      title: '匹配条件',
      dataIndex: 'conditions',
      key: 'conditions',
      render: (conditions: any) => (
        <div style={{ maxWidth: 300 }}>
          {Object.entries(conditions).map(([key, value]) => (
            <ConditionTag key={key} type={key} value={value} />
          ))}
        </div>
      ),
    },
    {
      title: '目标渠道',
      dataIndex: 'target_channels',
      key: 'target_channels',
      render: (channels: string[], record: any) => (
        <Space direction="vertical" size={4}>
          {channels.map((ch) => (
            <div key={ch} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color="blue">{channelNames[ch] || ch}</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                权重 {record.channel_weights[ch]}%
              </Text>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (active: boolean, record: any) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggle(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: any, index: number) => (
        <Space>
          <Tooltip title="上移">
            <Button
              type="text"
              icon={<ArrowUpOutlined />}
              disabled={index === 0}
              onClick={() => handleMoveUp(index)}
            />
          </Tooltip>
          <Tooltip title="下移">
            <Button
              type="text"
              icon={<ArrowDownOutlined />}
              disabled={index === strategies.length - 1}
              onClick={() => handleMoveDown(index)}
            />
          </Tooltip>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="确认删除"
            description="删除后不可恢复，是否继续？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
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
          <Text type="secondary">
            配置交易路由规则，优先级数字越小越优先匹配
          </Text>
        </Col>
        <Col>
          <Space>
            {hasChanges && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveOrder}
              >
                保存排序
              </Button>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              新建策略
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 提示卡片 */}
      <Card style={{ marginBottom: 24, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
        <Space align="start">
          <DragOutlined style={{ fontSize: 20, color: '#52c41a', marginTop: 2 }} />
          <div>
            <Text strong>排序说明</Text>
            <div>
              <Text type="secondary">
                • 使用上下箭头调整策略优先级，数字越小越优先匹配<br />
                • 调整顺序后点击「保存排序」按钮提交变更<br />
                • 交易路由时按优先级顺序匹配第一条符合条件的策略
              </Text>
            </div>
          </div>
        </Space>
      </Card>

      {/* 策略列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={strategies}
          rowKey="id"
          pagination={false}
          rowClassName={(record) => (record.is_active ? '' : 'ant-table-row-disabled')}
        />
      </Card>

      {/* 创建/编辑弹窗 */}
      <Modal
        title={editingStrategy ? '编辑路由策略' : '新建路由策略'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="策略名称"
            rules={[{ required: true, message: '请输入策略名称' }]}
          >
            <Input placeholder="例如：巴西大额优先" />
          </Form.Item>

          <Form.Item label="匹配条件">
            <Form.List name="conditions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Space key={field.key} align="baseline" style={{ marginBottom: 8 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'type']}
                        rules={[{ required: true }]}
                        noStyle
                      >
                        <Select style={{ width: 120 }} placeholder="条件类型">
                          <Option value="amount_min">金额≥</Option>
                          <Option value="amount_max">金额≤</Option>
                          <Option value="currency">币种</Option>
                          <Option value="country">国家</Option>
                          <Option value="merchant_id">商户ID</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'value']}
                        rules={[{ required: true, message: '请输入值' }]}
                        noStyle
                      >
                        <Input style={{ width: 200 }} placeholder="支持多个值用逗号分隔" />
                      </Form.Item>
                      <Button type="link" danger onClick={() => remove(field.name)}>
                        删除
                      </Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    + 添加条件
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            name="target_channels"
            label="目标渠道"
            rules={[{ required: true, message: '请选择目标渠道' }]}
          >
            <Select mode="multiple" placeholder="选择渠道">
              <Option value="ch_abc123">Stripe-Brazil</Option>
              <Option value="ch_def456">Adyen-Mexico</Option>
              <Option value="ch_ghi789">Pix-Local</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
