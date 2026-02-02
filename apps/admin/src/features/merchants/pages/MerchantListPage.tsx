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
  message,
  Spin,
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
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader } from '@psp/ui';
import { formatDate } from '@psp/shared';
import {
  useMerchants,
  useUpdateMerchantStatus,
  useExportMerchants,
  type MerchantListItem,
  type MerchantStatus,
  type KYBStatus,
  type RiskLevel,
  type ListMerchantsParams,
} from '@psp/api';
import {
  MerchantStatusBadge,
  KybStatusBadge,
  RiskLevelBadge,
  MerchantTypeBadge,
  CreateMerchantModal,
} from '../components';

const { RangePicker } = DatePicker;

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待审核' },
  { value: 'active', label: '正常' },
  { value: 'suspended', label: '已暂停' },
  { value: 'closed', label: '已关闭' },
  { value: 'rejected', label: '已拒绝' },
];

const kybStatusOptions = [
  { value: '', label: '全部 KYB' },
  { value: 'not_submitted', label: '未提交' },
  { value: 'submitted', label: '已提交' },
  { value: 'under_review', label: '审核中' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'need_more_info', label: '需补充' },
];

const riskLevelOptions = [
  { value: '', label: '全部风险' },
  { value: 'low', label: '低风险' },
  { value: 'medium', label: '中风险' },
  { value: 'high', label: '高风险' },
  { value: 'blacklist', label: '黑名单' },
];

export function MerchantListPage() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<ListMerchantsParams>({
    page: 1,
    page_size: 20,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  // API Hooks
  const {
    data: merchantsData,
    isLoading,
    refetch,
  } = useMerchants(filters);

  const updateStatusMutation = useUpdateMerchantStatus();
  const exportMutation = useExportMerchants();

  // Computed
  const merchants = merchantsData?.data ?? [];
  const total = merchantsData?.total ?? 0;

  // Handlers
  const handleSearch = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      keyword: searchKeyword || undefined,
      page: 1,
    }));
  }, [searchKeyword]);

  const handleFilterChange = useCallback((key: keyof ListMerchantsParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  }, []);

  const handleStatusChange = useCallback(async (merchantId: string, newStatus: MerchantStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: merchantId,
        status: newStatus,
      });
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  }, [updateStatusMutation]);

  const handleExport = useCallback(async () => {
    try {
      await exportMutation.mutateAsync({
        ...filters,
        format: 'xlsx',
      });
      message.success('导出任务已创建');
    } catch (error) {
      message.error('导出失败');
    }
  }, [exportMutation, filters]);

  const handleReset = useCallback(() => {
    setSearchKeyword('');
    setFilters({
      page: 1,
      page_size: 20,
    });
  }, []);

  // Row actions menu
  const getRowActions = (record: MerchantListItem): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => navigate({ to: '/merchants/$merchantId', params: { merchantId: record.id } }),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => navigate({ to: '/merchants/$merchantId', params: { merchantId: record.id } }),
    },
    { type: 'divider' },
    ...(record.status === 'active' ? [{
      key: 'suspend',
      icon: <PauseCircleOutlined />,
      label: '暂停',
      onClick: () => handleStatusChange(record.id, 'suspended'),
    }] : []),
    ...(record.status === 'suspended' ? [{
      key: 'activate',
      icon: <CheckCircleOutlined />,
      label: '激活',
      onClick: () => handleStatusChange(record.id, 'active'),
    }] : []),
    { type: 'divider' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '关闭',
      danger: true,
      onClick: () => handleStatusChange(record.id, 'closed'),
    },
  ];

  // Table columns
  const columns: TableColumnsType<MerchantListItem> = [
    {
      title: '商户编码',
      dataIndex: 'merchant_code',
      key: 'merchant_code',
      width: 120,
      render: (code: string) => (
        <Typography.Text code copyable style={{ fontFamily: 'var(--font-mono)' }}>
          {code}
        </Typography.Text>
      ),
    },
    {
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{record.legal_name}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'merchant_type',
      key: 'merchant_type',
      width: 100,
      render: (type: 'individual' | 'company') => <MerchantTypeBadge type={type} />,
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
      dataIndex: 'kyb_status',
      key: 'kyb_status',
      width: 100,
      render: (status: KYBStatus) => <KybStatusBadge status={status} />,
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      width: 100,
      render: (level: RiskLevel) => <RiskLevelBadge level={level} />,
    },
    {
      title: '国家/地区',
      dataIndex: 'country_code',
      key: 'country_code',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) => formatDate(date, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_: any, record: MerchantListItem) => (
        <Dropdown menu={{ items: getRowActions(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        title="商户管理"
        subtitle={`共 ${total} 个商户`}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined spin={isLoading} />}
              onClick={() => refetch()}
            >
              刷新
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={exportMutation.isPending}
            >
              导出
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              新建商户
            </Button>
          </Space>
        }
      />

      {/* Filter Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Input
            placeholder="搜索商户名/编码"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="状态"
            options={statusOptions}
            value={filters.status ?? ''}
            onChange={(v) => handleFilterChange('status', v)}
            style={{ width: 120 }}
          />
          <Select
            placeholder="KYB 状态"
            options={kybStatusOptions}
            value={filters.kyb_status ?? ''}
            onChange={(v) => handleFilterChange('kyb_status', v)}
            style={{ width: 120 }}
          />
          <Select
            placeholder="风险等级"
            options={riskLevelOptions}
            value={filters.risk_level ?? ''}
            onChange={(v) => handleFilterChange('risk_level', v)}
            style={{ width: 120 }}
          />
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                handleFilterChange('start_date', dates[0]?.format('YYYY-MM-DD'));
                handleFilterChange('end_date', dates[1]?.format('YYYY-MM-DD'));
              } else {
                handleFilterChange('start_date', undefined);
                handleFilterChange('end_date', undefined);
              }
            }}
          />
          <Button onClick={handleSearch} type="primary">
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={merchants}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              current: filters.page,
              pageSize: filters.page_size,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setFilters(prev => ({
                  ...prev,
                  page,
                  page_size: pageSize,
                }));
              },
            }}
          />
        </Spin>
      </Card>

      {/* Create Modal */}
      <CreateMerchantModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

export default MerchantListPage;
