import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, Button, Typography, Modal, Input, Empty, Tag, message } from 'antd';
import {
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export const Route = createFileRoute('/_authenticated/settings/trusted-devices')({
  component: TrustedDevicesPage,
});

interface TrustedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  ip: string;
  location: string;
  lastUsed: string;
  expireDate: string;
  isCurrent: boolean;
}

// Mock data
const MOCK_DEVICES: TrustedDevice[] = [
  {
    id: '1',
    name: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS',
    browser: 'Chrome 120',
    ip: '192.168.*.*',
    location: '上海',
    lastUsed: '刚刚',
    expireDate: '2026-02-09',
    isCurrent: true,
  },
  {
    id: '2',
    name: 'iPhone 15',
    type: 'mobile',
    os: 'iOS',
    browser: 'Safari 17',
    ip: '10.0.*.*',
    location: '上海',
    lastUsed: '2 小时前',
    expireDate: '2026-02-08',
    isCurrent: false,
  },
  {
    id: '3',
    name: '办公室 Windows',
    type: 'desktop',
    os: 'Windows 11',
    browser: 'Edge',
    ip: '172.16.*.*',
    location: '深圳',
    lastUsed: '1 天前',
    expireDate: '2026-02-05',
    isCurrent: false,
  },
  {
    id: '4',
    name: 'iPad Air',
    type: 'tablet',
    os: 'iPadOS',
    browser: 'Safari',
    ip: '192.168.*.*',
    location: '上海',
    lastUsed: '3 天前',
    expireDate: '2026-02-03',
    isCurrent: false,
  },
];

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  deviceList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  deviceCard: {
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  deviceContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    background: '#eef2ff',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: '#6366f1',
    fontSize: 18,
  },
  deviceInfo: {
    flex: 1,
    minWidth: 0,
  },
  deviceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap' as const,
  },
  deviceName: {
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    padding: '2px 4px',
    margin: '-2px -4px',
    borderRadius: 4,
    transition: 'background 200ms ease',
  },
  deviceMeta: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  deviceActions: {
    flexShrink: 0,
  },
  editInput: {
    width: 180,
    fontWeight: 600,
    fontSize: 14,
  },
};

const DeviceIcon: React.FC<{ type: TrustedDevice['type'] }> = ({ type }) => {
  switch (type) {
    case 'mobile':
      return <MobileOutlined />;
    case 'tablet':
      return <TabletOutlined />;
    default:
      return <DesktopOutlined />;
  }
};

function TrustedDevicesPage() {
  const [devices, setDevices] = useState<TrustedDevice[]>(MOCK_DEVICES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; device?: TrustedDevice }>({
    visible: false,
  });
  const [revokeAllModal, setRevokeAllModal] = useState(false);

  const handleStartEdit = (device: TrustedDevice) => {
    setEditingId(device.id);
    setEditName(device.name);
  };

  const handleSaveEdit = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: editName || d.name } : d))
    );
    setEditingId(null);
    message.success('设备名称已更新');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (device: TrustedDevice) => {
    setDeleteModal({ visible: true, device });
  };

  const confirmDelete = () => {
    if (deleteModal.device) {
      setDevices((prev) => prev.filter((d) => d.id !== deleteModal.device!.id));
      message.success('设备已撤销信任');
    }
    setDeleteModal({ visible: false });
  };

  const handleRevokeAll = () => {
    setRevokeAllModal(true);
  };

  const confirmRevokeAll = () => {
    setDevices([]);
    setRevokeAllModal(false);
    message.success('已撤销所有设备信任');
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <Typography.Title level={4} style={styles.pageTitle}>
            信任设备管理
          </Typography.Title>
          <Typography.Text style={styles.pageSubtitle}>
            管理已信任的设备，信任设备在 7 天内免 MFA 验证
          </Typography.Text>
        </div>
        {devices.length > 0 && (
          <Button
            danger
            ghost
            icon={<CloseCircleOutlined />}
            onClick={handleRevokeAll}
          >
            撤销所有设备
          </Button>
        )}
      </div>

      {devices.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Typography.Text strong>暂无信任设备</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  登录时勾选"信任此设备"可添加信任设备
                </Typography.Text>
              </div>
            }
          />
        </Card>
      ) : (
        <div style={styles.deviceList}>
          {devices.map((device) => (
            <Card key={device.id} style={styles.deviceCard} styles={{ body: { padding: 16 } }}>
              <div style={styles.deviceContent}>
                <div style={styles.deviceIcon}>
                  <DeviceIcon type={device.type} />
                </div>
                <div style={styles.deviceInfo}>
                  <div style={styles.deviceHeader}>
                    {editingId === device.id ? (
                      <>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={styles.editInput}
                          autoFocus
                          onPressEnter={() => handleSaveEdit(device.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => handleSaveEdit(device.id)}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={handleCancelEdit}
                        />
                      </>
                    ) : (
                      <>
                        <span
                          style={styles.deviceName}
                          onClick={() => handleStartEdit(device)}
                          title="点击编辑"
                        >
                          {device.name}
                          <EditOutlined style={{ marginLeft: 4, fontSize: 12, opacity: 0.5 }} />
                        </span>
                        {device.isCurrent && <Tag color="success">当前设备</Tag>}
                      </>
                    )}
                  </div>
                  <div style={styles.deviceMeta}>
                    {device.os} / {device.browser} | {device.ip} | {device.location}
                  </div>
                  <div style={styles.deviceMeta}>最后使用：{device.lastUsed}</div>
                  <div style={{ ...styles.deviceMeta, fontFamily: "'JetBrains Mono', monospace" }}>
                    信任到期：{device.expireDate}
                  </div>
                </div>
                <div style={styles.deviceActions}>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(device)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Single Device Modal */}
      <Modal
        title="撤销设备信任"
        open={deleteModal.visible}
        onCancel={() => setDeleteModal({ visible: false })}
        onOk={confirmDelete}
        okText="撤销信任"
        okButtonProps={{ danger: true }}
        cancelText="取消"
      >
        <Typography.Text>
          确定要撤销 <strong>{deleteModal.device?.name}</strong> 的信任状态吗？
        </Typography.Text>
        <br />
        <Typography.Text type="secondary">
          下次使用该设备登录时需要重新进行 MFA 验证。
        </Typography.Text>
      </Modal>

      {/* Revoke All Modal */}
      <Modal
        title="撤销所有设备"
        open={revokeAllModal}
        onCancel={() => setRevokeAllModal(false)}
        onOk={confirmRevokeAll}
        okText="撤销所有"
        okButtonProps={{ danger: true }}
        cancelText="取消"
      >
        <Typography.Text>确定要撤销所有设备的信任状态吗？</Typography.Text>
        <br />
        <Typography.Text type="secondary">
          所有设备（包括当前设备）下次登录时都需要重新进行 MFA 验证。
        </Typography.Text>
      </Modal>
    </div>
  );
}
