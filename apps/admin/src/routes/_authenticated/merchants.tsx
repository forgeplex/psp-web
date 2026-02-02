import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Typography,
  Dropdown,
  message,
  Tooltip,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { brandColors } from '@psp/shared';
import {
  MerchantStatusBadge,
  KYBStatusBadge,
  RiskLevelBadge,
  CreateMerchantModal,
  type MerchantStatus,
  type KYBStatus,
  type RiskLevel,
} from '../../components/merchants';

export const Route = createFileRoute('/_authenticated/merchants')({
  component: MerchantsPage,
});

interface Merchant {
  id: string;
  merchant_code: string;
  merchant_name: string;
  legal_name: string;
  merchant_type: 'individual' | 'company';
  status: MerchantStatus;
  kyb_status: KYBStatus;
  risk_level: RiskLevel;
  country_code: string;
  created_at: string;
}

// Mock data
const mockMerchants: Merchant[] = [
  {
    id: '1',
    merchant_code: 'M001',
    merchant_name: '某某电商',
    legal_name: '某某科技有限公司',
    merchant_type: 'company',
    status: 'active',
    kyb_status: 'verified',
    risk_level: 'low',
    country_code: 'BR',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    merchant_code: 'M002',
    merchant_name: '跨境支付',
    legal_name: '跨境支付服务商',
    merchant_type: 'company',
    status: 'active',
    kyb_status: 'verified',
    risk_level: 'medium',
    country_code: 'MX',
    created_at: '2024-01-10',
  },
  {
    id: '3',
    merchant_code: 'M003',
    merchant_name: '小王商店',
    legal_name: '王小明',
    merchant_type: 'individual',
    status: 'pending',
    kyb_status: 'pending',
    risk_level: 'low',
    country_code: 'BR',
    created_at: '2024-01-08',
  },
  {
    id: '4',
    merchant_code: 'M004',
    merchant_name: '数码专营',
    legal_name: '数码科技公司',
    merchant_type: 'company',
    status: 'suspended',
    kyb_status: 'verified',
    risk_level: 'high',
    country_code: 'US',
    created_at: '2024-01-05',
  },
  {
    id: '5',
    merchant_code: 'M005',
    merchant_name: '服装批发',
    legal_name: '服装贸易公司',
    merchant_type: 'company',
    status: 'active',
    kyb_status: 'in_review',
    risk_level: 'medium',
    country_code: 'BR',
    created_at: '2024-01-03',
  },
  {
    id: '6',
    merchant_code: 'M006',
    merchant_name: '食品进口',
    legal_name: '食品进口商',
    merchant_type: 'company',
    status: 'rejected',
    kyb_status: 'rejected',
    risk_level: 'critical',
    country_code: 'MX',
    created_at: '2024-01-01',
  },
];

const countryFlags: Record<string, string> = {
  BR: '🇧🇷',
  MX: '🇲🇽',
  US: '🇺🇸',
  CN: '🇨🇳',
};

function MerchantsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [kybFilter, setKybFilter] = useState<string>();

  const getActionMenu = (record: Merchant): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => message.info(`查看商户: ${record.merchant_name}`),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => message.info(`编辑商户: ${record.merchant_name}`),
    },
    { type: 'divider' },
    record.status === 'active'
      ? {
          key: 'suspend',
          icon: <StopOutlined />,
          label: '暂停',
          danger: true,
          onClick: () => message.warning(`暂停商户: ${record.merchant_name}`),
        }
      : {
          key: 'activate',
          icon: <CheckCircleOutlined />,
          label: '激活',
          onClick: () => message.success(`激活商户: ${record.merchant_name}`),
        },
  ];

  const columns: TableProps<Merchant>['columns'] = [
    {
      title: '商户编码',
      dataIndex: 'merchant_code',
      key: 'merchant_code',
      width: 100,
      render: (code) => (
        <Typography.Text code style={{ color: brandColors.primary }}>
          {code}
        </Typography.Text>
      ),
    },
    {
      title: '商户名称',
      dataIndex: 'merchant_name',
      key: 'merchant_name',
      width: 140,
    },
    {
      title: '法人名称',
      dataIndex: 'legal_name',
      key: 'legal_name',
      width: 160,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'merchant_type',
      key: 'merchant_type',
      width: 80,
      render: (type) => (type === 'company' ? '企业' : '个人'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: MerchantStatus) => <MerchantStatusBadge status={status} />,
    },
    {
      title: 'KYB',
      dataIndex: 'kyb_status',
      key: 'kyb_status',
      width: 90,
      render: (status: KYBStatus) => <KYBStatusBadge status={status} />,
    },
    {
      title: '风险',
      dataIndex: 'risk_level',
      key: 'risk_level',
      width: 70,
      render: (level: RiskLevel) => <RiskLevelBadge level={level} />,
    },
    {
      title: '国家',
      dataIndex: 'country_code',
      key: 'country_code',
      width: 70,
      render: (code) => (
        <span>
          {countryFlags[code]} {code}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredData = mockMerchants.filter((m) => {
    if (searchText && !m.merchant_name.includes(searchText) && !m.merchant_code.includes(searchText)) {
      return false;
    }
    if (statusFilter && m.status !== statusFilter) return false;
    if (kybFilter && m.kyb_status !== kybFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="商户管理"
        extra={
          <Space>
            <Button icon={<DownloadOutlined />}>导出</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: brandColors.primary }}
              onClick={() => setCreateModalOpen(true)}
            >
              新建商户
            </Button>
          </Space>
        }
      />

      <Card
        style={{ borderRadius: 8, marginTop: 16 }}
        styles={{ body: { padding: 16 } }}
      >
        {/* Filters */}
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索商户名称/编码"
            prefix={<SearchOutlined style={{ color: '#64748B' }} />}
            style={{ width: 220 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            placeholder="状态"
            style={{ width: 120 }}
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'pending', label: '待审核' },
              { value: 'active', label: '已激活' },
              { value: 'suspended', label: '已暂停' },
              { value: 'closed', label: '已关闭' },
              { value: 'rejected', label: '已拒绝' },
            ]}
          />
          <Select
            placeholder="KYB 状态"
            style={{ width: 120 }}
            allowClear
            value={kybFilter}
            onChange={setKybFilter}
            options={[
              { value: 'pending', label: '待提交' },
              { value: 'in_review', label: '审核中' },
              { value: 'verified', label: '已验证' },
              { value: 'rejected', label: '已拒绝' },
            ]}
          />
          <Select
            placeholder="国家"
            style={{ width: 100 }}
            allowClear
            options={[
              { value: 'BR', label: '🇧🇷 BR' },
              { value: 'MX', label: '🇲🇽 MX' },
              { value: 'US', label: '🇺🇸 US' },
            ]}
          />
          <DatePicker.RangePicker placeholder={['开始日期', '结束日期']} />
        </Space>

        {/* Batch actions */}
        {selectedRowKeys.length > 0 && (
          <div
            style={{
              padding: '8px 12px',
              background: brandColors.primaryLight,
              borderRadius: 6,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Typography.Text>已选 {selectedRowKeys.length} 项</Typography.Text>
            <Button size="small" type="primary" style={{ background: brandColors.primary }}>
              批量激活
            </Button>
            <Button size="small" danger>
              批量暂停
            </Button>
            <Button size="small" type="link" onClick={() => setSelectedRowKeys([])}>
              取消选择
            </Button>
          </div>
        )}

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="small"
          scroll={{ x: 1100 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            total: 156,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 共 ${total} 条`,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100'],
            defaultPageSize: 20,
          }}
        />
      </Card>

      <CreateMerchantModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          message.success('商户创建成功');
        }}
      />
    </div>
  );
}
