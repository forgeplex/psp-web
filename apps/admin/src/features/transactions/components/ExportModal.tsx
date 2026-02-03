import React, { useState } from 'react';
import { Modal, Form, Select, Checkbox, Button, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface ExportModalProps {
  visible: boolean;
  onCancel: () => void;
  filters?: Record<string, any>;
}

const exportFields = [
  { label: '交易ID', value: 'id', default: true },
  { label: '订单号', value: 'orderId', default: true },
  { label: '类型', value: 'type', default: true },
  { label: '状态', value: 'status', default: true },
  { label: '金额', value: 'amount', default: true },
  { label: '币种', value: 'currency', default: true },
  { label: '用户ID', value: 'userId', default: false },
  { label: '用户名', value: 'userName', default: true },
  { label: '支付方式', value: 'paymentMethod', default: true },
  { label: '创建时间', value: 'createdAt', default: true },
  { label: '完成时间', value: 'completedAt', default: false },
];

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onCancel,
  filters,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleExport = async (values: any) => {
    setLoading(true);
    try {
      // TODO: 调用真实导出 API
      console.log('导出参数:', { ...values, filters });
      message.success('导出任务已创建，请稍后下载');
      onCancel();
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  const defaultFields = exportFields
    .filter(f => f.default)
    .map(f => f.value);

  return (
    <Modal
      title="导出交易数据"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleExport}
        initialValues={{
          format: 'xlsx',
          fields: defaultFields,
        }}
      >
        <Form.Item
          name="format"
          label="导出格式"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="xlsx">Excel (.xlsx)</Select.Option>
            <Select.Option value="csv">CSV (.csv)</Select.Option>
            <Select.Option value="json">JSON (.json)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fields"
          label="导出字段"
          rules={[{ required: true, message: '请至少选择一个字段' }]}
        >
          <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {exportFields.map(field => (
              <Checkbox key={field.value} value={field.value}>
                {field.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<DownloadOutlined />}
              loading={loading}
            >
              导出
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
