import React from 'react';
import { Modal, Form, Input, Select, Radio, Row, Col, message } from 'antd';
import { useCreateMerchant, type CreateMerchantRequest } from '@psp/api';

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
  { value: 'IN', label: '🇮🇳 IN - 印度' },
];

export const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<CreateMerchantRequest>();
  const createMutation = useCreateMerchant();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createMutation.mutateAsync(values);
      
      message.success('商户创建成功');
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      message.error(error?.message || '创建失败');
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
      confirmLoading={createMutation.isPending}
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          merchant_type: 'company',
          country_code: 'BR',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="merchant_code"
              label="商户编码"
              rules={[
                { required: true, message: '请输入商户编码' },
                { pattern: /^[A-Z0-9]{3,20}$/, message: '3-20位大写字母或数字' },
              ]}
            >
              <Input placeholder="M001" style={{ fontFamily: 'var(--font-mono)' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="merchant_type"
              label="商户类型"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio.Button value="company">企业</Radio.Button>
                <Radio.Button value="individual">个人</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="merchant_name"
              label="商户名称"
              rules={[{ required: true, message: '请输入商户名称' }]}
            >
              <Input placeholder="某某电商" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="legal_name"
              label="法人/公司全称"
              rules={[{ required: true, message: '请输入法人/公司全称' }]}
            >
              <Input placeholder="某某科技有限公司" />
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
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="merchant@example.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="电话"
            >
              <Input placeholder="+55 11 99999-9999" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="country_code"
              label="国家/地区"
              rules={[{ required: true, message: '请选择国家/地区' }]}
            >
              <Select options={countryOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="industry"
              label="行业"
            >
              <Select
                placeholder="选择行业"
                options={[
                  { value: 'ecommerce', label: '电子商务' },
                  { value: 'gaming', label: '游戏' },
                  { value: 'fintech', label: '金融科技' },
                  { value: 'travel', label: '旅游' },
                  { value: 'education', label: '教育' },
                  { value: 'other', label: '其他' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="website"
          label="网站"
        >
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item
          name="mcc"
          label="MCC 编码"
          extra="商户类别代码 (Merchant Category Code)"
        >
          <Input placeholder="5411" maxLength={4} style={{ width: 120, fontFamily: 'var(--font-mono)' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMerchantModal;
