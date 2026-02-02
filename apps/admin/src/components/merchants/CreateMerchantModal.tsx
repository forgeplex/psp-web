import React from 'react';
import { Modal, Form, Input, Select, Radio, Row, Col, message } from 'antd';
import { brandColors } from '@psp/shared';

interface CreateMerchantModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface CreateMerchantForm {
  merchant_code: string;
  merchant_name: string;
  legal_name: string;
  merchant_type: 'individual' | 'company';
  email: string;
  country_code: string;
  phone?: string;
  mcc?: string;
  industry?: string;
  website?: string;
}

const countries = [
  { value: 'BR', label: '🇧🇷 巴西' },
  { value: 'MX', label: '🇲🇽 墨西哥' },
  { value: 'US', label: '🇺🇸 美国' },
  { value: 'CN', label: '🇨🇳 中国' },
];

export const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateMerchantForm>();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // TODO: API call
      console.log('Creating merchant:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('商户创建成功');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="新建商户"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="创建"
      cancelText="取消"
      confirmLoading={loading}
      width={640}
      styles={{
        header: { borderBottom: `1px solid #E2E8F0`, paddingBottom: 16 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 24 }}
        initialValues={{ merchant_type: 'company', country_code: 'BR' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="merchant_code"
              label="商户编码"
              rules={[{ required: true, message: '请输入商户编码' }]}
            >
              <Input placeholder="如: M001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="merchant_name"
              label="商户名称"
              rules={[{ required: true, message: '请输入商户名称' }]}
            >
              <Input placeholder="商户显示名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="legal_name"
              label="法人名称"
              rules={[{ required: true, message: '请输入法人名称' }]}
            >
              <Input placeholder="法律实体名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="merchant_type" label="类型">
              <Radio.Group>
                <Radio value="company">企业</Radio>
                <Radio value="individual">个人</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效邮箱' },
              ]}
            >
              <Input placeholder="merchant@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="country_code"
              label="国家"
              rules={[{ required: true, message: '请选择国家' }]}
            >
              <Select options={countries} placeholder="选择国家" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="电话">
              <Input placeholder="+55 11 99999-9999" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mcc" label="MCC">
              <Input placeholder="如: 5411" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industry" label="行业">
              <Input placeholder="如: 电子商务" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="website" label="网站">
              <Input placeholder="https://example.com" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
