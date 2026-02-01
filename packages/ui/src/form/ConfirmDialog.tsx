import React from 'react';
import { Modal, Typography, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  title = '确认操作',
  description,
  confirmText = '确认',
  cancelText = '取消',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={null}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{
        danger,
        loading,
      }}
      width={420}
      centered
    >
      <Space align="start" size={16} style={{ padding: '8px 0' }}>
        <ExclamationCircleFilled
          style={{
            fontSize: 22,
            color: danger ? '#EF4444' : '#F59E0B',
            marginTop: 2,
          }}
        />
        <div>
          <Typography.Text strong style={{ fontSize: 16 }}>
            {title}
          </Typography.Text>
          {description && (
            <Typography.Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
              {description}
            </Typography.Paragraph>
          )}
        </div>
      </Space>
    </Modal>
  );
}
