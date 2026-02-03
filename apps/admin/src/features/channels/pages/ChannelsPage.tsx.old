import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Drawer, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader } from '@psp/ui';
import type { Channel, ChannelStatus } from '../types/domain';
import { 
  useChannels, 
  useCreateChannel, 
  useUpdateChannel, 
  useToggleChannel 
} from '../hooks';
import { ChannelForm } from '../components/ChannelForm';

export function ChannelsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | undefined>();
  
  const { data, isLoading } = useChannels({ keyword: searchKeyword });
  const createMutation = useCreateChannel();
  const updateMutation = useUpdateChannel();
  const toggleMutation = useToggleChannel();

  const handleCreate = () => {
    setEditingChannel(undefined);
    setDrawerVisible(true);
  };

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel);
    setDrawerVisible(true);
  };

  const handleToggleStatus = (channel: Channel) => {
    const newStatus: ChannelStatus = channel.status === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'enable' : 'disable';
    
    Modal.confirm({
      title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Channel`,
      content: `Are you sure you want to ${actionText} "${channel.name}"?`,
      onOk: async () => {
        try {
          await toggleMutation.mutateAsync({ channelId: channel.id, status: newStatus });
          message.success(`Channel ${actionText}d successfully`);
        } catch {
          message.error(`Failed to ${actionText} channel`);
        }
      },
    });
  };

  const handleSubmit = async (values: Partial<Channel>) => {
    try {
      if (editingChannel) {
        await updateMutation.mutateAsync({ channelId: editingChannel.id, payload: values });
        message.success('Channel updated successfully');
      } else {
        await createMutation.mutateAsync(values);
        message.success('Channel created successfully');
      }
      setDrawerVisible(false);
    } catch {
      message.error(editingChannel ? 'Failed to update channel' : 'Failed to create channel');
    }
  };

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      width: 100,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: Channel['status']) => (
        <Tag color={value === 'active' ? 'green' : value === 'maintenance' ? 'orange' : 'default'}>
          {value}
        </Tag>
      ),
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 80 },
    {
      title: 'Health',
      dataIndex: 'health_status',
      key: 'health_status',
      width: 100,
      render: (value: Channel['health_status']) => (
        <Tag color={value === 'healthy' ? 'green' : value === 'degraded' ? 'orange' : value === 'failed' ? 'red' : 'default'}>
          {value}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Channel) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          />
        </Space>
      ),
    },
  ];

  const isMutating = createMutation.isPending || updateMutation.isPending || toggleMutation.isPending;

  return (
    <div>
      <PageHeader title="Channels" />
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search channels..."
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Channel
          </Button>
        </Space>
        
        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={data?.items || []} 
          loading={isLoading}
          pagination={{
            total: data?.total,
            pageSize: data?.pageSize || 10,
            current: data?.page || 1,
          }}
        />
      </Card>

      <Drawer
        title={editingChannel ? 'Edit Channel' : 'Create Channel'}
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        destroyOnClose
      >
        <ChannelForm
          initialValues={editingChannel}
          onSubmit={handleSubmit}
          onCancel={() => setDrawerVisible(false)}
          loading={isMutating}
        />
      </Drawer>
    </div>
  );
}
