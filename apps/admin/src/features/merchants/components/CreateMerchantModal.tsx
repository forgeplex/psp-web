import React from 'react';
import { Modal, Form, Input, Select, Radio, Row, Col, message } from 'antd';
import type { CreateMerchantForm } from '../types';

interface CreateMerchantModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const countryOptions = [
  { value: 'BR', label: '🇧🇷 BR - 巴西' },
  { value: 'MX', label: '🇲🇽 MX - 墨西哥' },
  { value: 'US', label: '🇺🇸 US - 美国' },
  { value: 'AR', label: '🇦🇷 AR - 阿根廷' },
  { value: 'CO', label: '🇨🇴 CO - 哥伦比亚' },
];

export const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateMerchantForm>();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // TODO: Replace with actual API call
      console.log('Creating merchant:', values);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      message.success('商户创建成功');
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="新建商户"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="创建"
      cancelText="取消"
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: 'company' }}
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="商户编码"
              rules={[{ required: true, message: '请输入商户编码' }]}
            >
              <Input placeholder="例: M007" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="商户名称"
              rules={[{ required: true, message: '请输入商户名称' }]}
            >
              <Input placeholder="商户显示名称" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="legalName"
          label="法人名称"
          rules={[{ required: true, message: '请输入法人名称' }]}
        >
          <Input placeholder="公司全称或个人姓名" />
        </Form.Item>

        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择商户类型' }]}
        >
          <Radio.Group>
            <Radio value="company">Company</Radio>
            <Radio value="individual">Individual</Radio>
          </Radio.Group>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="merchant@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="country"
              label="国家"
              rules={[{ required: true, message: '请选择国家' }]}
            >
              <Select placeholder="请选择国家" options={countryOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="电话">
              <Input placeholder="+55 11 9999-0000" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mcc" label="MCC">
              <Input placeholder="例: 5411" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industry" label="行业">
              <Input placeholder="例: 电子商务" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="website" label="网站">
              <Input placeholder="https://" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
