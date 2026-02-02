import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Dropdown,
  Typography,
  Alert,
  message,
} from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { formatDate, baseColors } from '@psp/shared';
import {
  MerchantStatusBadge,
  KybStatusBadge,
  RiskLevelBadge,
  MerchantTypeBadge,
  CreateMerchantModal,
} from '../components';
import type { Merchant, MerchantStatus, KybStatus } from '../types';

const { RangePicker } = DatePicker;

// Mock data - replace with API call
const mockMerchants: Merchant[] = [
  {
    id: '1',
    code: 'M001',
    name: '某某电商',
    legalName: '某某科技有限公司',
    type: 'company',
    status: 'active',
    kybStatus: 'verified',
    riskLevel: 'low',
    email: 'merchant@example.com',
    country: 'BR',
    createdAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    code: 'M002',
    name: '跨境支付',
    legalName: '跨境支付服务商',
    type: 'company',
    status: 'active',
    kybStatus: 'verified',
    riskLevel: 'medium',
    email: 'cross@example.com',
    country: 'MX',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    code: 'M003',
    name: '小王商店',
    legalName: '王小明',
    type: 'individual',
    status: 'pending',
    kybStatus: 'pending',
    riskLevel: 'low',
    email: 'wang@example.com',
    country: 'BR',
    createdAt: '2024-01-08T09:00:00Z',
  },
  {
    id: '4',
    code: 'M004',
    name: '数码专营',
    legalName: '数码科技公司',
    type: 'company',
    status: 'suspended',
    kybStatus: 'verified',
    riskLevel: 'high',
    email: 'digital@example.com',
    country: 'US',
    createdAt: '2024-01-05T16:00:00Z',
  },
  {
    id: '5',
    code: 'M005',
    name: '服装批发',
    legalName: '服装贸易公司',
    type: 'company',
    status: 'active',
    kybStatus: 'in_review',
    riskLevel: 'medium',
    email: 'fashion@example.com',
    country: 'BR',
    createdAt: '2024-01-03T11:00:00Z',
  },
  {
    id: '6',
    code: 'M006',
    name: '食品进口',
    legalName: '食品进口商',
    type: 'company',
    status: 'rejected',
    kybStatus: 'rejected',
    riskLevel: 'critical',
    email: 'food@example.com',
    country: 'MX',
    createdAt: '2024-01-01T08:00:00Z',
  },
];

const statusOptions = [
  { value: '', label: '状态: 全部' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

const kybOptions = [
  { value: '', label: 'KYB: 全部' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

const countryOptions = [
  { value: '', label: '国家: 全部' },
  { value: 'BR', label: 'BR' },
  { value: 'MX', label: 'MX' },
  { value: 'US', label: 'US' },
  { value: 'AR', label: 'AR' },
  { value: 'CO', label: 'CO' },
];

export const MerchantListPage: React.FC = () => {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kybFilter, setKybFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Filter data
  const filteredData = useMemo(() => {
    return mockMerchants.filter((m) => {
      if (searchText) {
        const query = searchText.toLowerCase();
        if (
          !m.name.toLowerCase().includes(query) &&
          !m.code.toLowerCase().includes(query) &&
          !m.legalName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      if (statusFilter && m.status !== statusFilter) return false;
      if (kybFilter && m.kybStatus !== kybFilter) return false;
      if (countryFilter && m.country !== countryFilter) return false;
      return true;
    });
  }, [searchText, statusFilter, kybFilter, countryFilter]);

  const handleReset = () => {
    setSearchText('');
    setStatusFilter('');
    setKybFilter('');
    setCountryFilter('');
    setSelectedRowKeys([]);
  };

  const handleViewDetail = useCallback((merchantId: string) => {
    navigate({ to: '/merchants/$merchantId', params: { merchantId } });
  }, [navigate]);

  const handleBulkActivate = useCallback(() => {
    message.success(`已激活 ${selectedRowKeys.length} 个商户`);
    setSelectedRowKeys([]);
  }, [selectedRowKeys]);

  const handleBulkSuspend = useCallback(() => {
    message.warning(`已暂停 ${selectedRowKeys.length} 个商户`);
    setSelectedRowKeys([]);
  }, [selectedRowKeys]);

  const getActionMenu = useCallback((record: Merchant): MenuProps => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: '详情',
        onClick: () => handleViewDetail(record.id),
      },
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑',
        onClick: () => {
          message.info('编辑功能开发中');
        },
      },
      { type: 'divider' },
      {
        key: 'toggle',
        icon: record.status === 'active' ? <PauseCircleOutlined /> : <CheckCircleOutlined />,
        label: record.status === 'active' ? '暂停' : '激活',
        onClick: () => {
          message.success(`已${record.status === 'active' ? '暂停' : '激活'}商户: ${record.name}`);
        },
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => {
          message.error('删除功能需要确认');
        },
      },
    ],
  }), [handleViewDetail]);

  const columns: TableColumnsType<Merchant> = [
    {
      title: '商户编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string, record: Merchant) => (
        <Typography.Link
          strong
          style={{ color: '#6366f1', fontFamily: 'JetBrains Mono, monospace' }}
          onClick={() => handleViewDetail(record.id)}
        >
          {code}
        </Typography.Link>
      ),
    },
    {
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (name: string, record: Merchant) => (
        <Typography.Link strong onClick={() => handleViewDetail(record.id)}>
          {name}
        </Typography.Link>
      ),
    },
    {
      title: '法人名称',
      dataIndex: 'legalName',
      key: 'legalName',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: 'company' | 'individual') => <MerchantTypeBadge type={type} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: MerchantStatus) => <MerchantStatusBadge status={status} />,
    },
    {
      title: 'KYB 状态',
      dataIndex: 'kybStatus',
      key: 'kybStatus',
      width: 120,
      render: (status: KybStatus) => <KybStatusBadge status={status} />,
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 90,
      render: (level) => <RiskLevelBadge level={level} />,
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      width: 60,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date: string) => (
        <Typography.Text style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
          {formatDate(date)}
        </Typography.Text>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 60,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="商户管理"
        extra={
          <Space>
            <Button icon={<DownloadOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
              新建商户
            </Button>
          </Space>
        }
      />

      <Card style={{ borderRadius: 8 }}>
        {/* Filter Bar */}
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索商户名称/编码/邮箱"
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ width: 130 }}
          />
          <Select
            value={kybFilter}
            onChange={setKybFilter}
            options={kybOptions}
            style={{ width: 130 }}
          />
          <Select
            value={countryFilter}
            onChange={setCountryFilter}
            options={countryOptions}
            style={{ width: 110 }}
          />
          <RangePicker style={{ width: 240 }} />
          <Button onClick={handleReset}>重置</Button>
        </Space>

        {/* Bulk Actions Bar */}
        {selectedRowKeys.length > 0 && (
          <Alert
            type="info"
            message={
              <Space>
                <span>已选 <strong>{selectedRowKeys.length}</strong> 项</span>
                <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={handleBulkActivate}>
                  批量激活
                </Button>
                <Button size="small" danger icon={<PauseCircleOutlined />} onClick={handleBulkSuspend}>
                  批量暂停
                </Button>
                <Button size="small" type="link" onClick={() => setSelectedRowKeys([])}>
                  取消选择
                </Button>
              </Space>
            }
            style={{ marginBottom: 16, backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}
          />
        )}

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1100 }}
          pagination={{
            total: filteredData.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 共 ${total} 条`,
          }}
          size="middle"
        />
      </Card>

      {/* Create Modal */}
      <CreateMerchantModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          // TODO: Refresh list
          message.success('请刷新列表查看新商户');
        }}
      />
    </div>
  );
};
