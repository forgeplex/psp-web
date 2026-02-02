import React, { useState } from 'react';
import { Button, Alert, Checkbox, message } from 'antd';
import { CopyOutlined, DownloadOutlined, WarningFilled } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

interface BackupCodesProps {
  codes: string[];
  onConfirm: () => void;
  loading?: boolean;
}

const styles = {
  warning: {
    marginBottom: 24,
  },
  codesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
    marginBottom: 16,
    padding: 16,
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 500,
    color: '#0f172a',
    padding: 8,
    background: '#ffffff',
    borderRadius: 4,
    textAlign: 'center' as const,
  },
  actions: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  },
  checkbox: {
    marginBottom: 16,
  },
};

export const BackupCodes: React.FC<BackupCodesProps> = ({
  codes,
  onConfirm,
  loading = false,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      message.success('已复制到剪贴板');
    } catch {
      message.error('复制失败');
    }
  };

  const handleDownload = () => {
    const content = `PSP Admin 备用码\n\n${codes.join('\n')}\n\n请妥善保存，每个备用码只能使用一次。`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'psp-admin-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    message.success('下载完成');
  };

  return (
    <>
      <Alert
        type="warning"
        icon={<WarningFilled />}
        message="这些备用码只会显示一次，请妥善保存。每个备用码只能使用一次。"
        style={styles.warning}
        showIcon
      />

      <div style={styles.codesContainer}>
        {codes.map((code) => (
          <div key={code} style={styles.code}>
            {code}
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <Button icon={<CopyOutlined />} onClick={handleCopy} style={{ flex: 1 }}>
          复制全部
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleDownload} style={{ flex: 1 }}>
          下载
        </Button>
      </div>

      <div style={styles.checkbox}>
        <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
          我已安全保存这些备用码
        </Checkbox>
      </div>

      <Button
        type="primary"
        block
        disabled={!confirmed}
        loading={loading}
        onClick={onConfirm}
        style={{
          height: 42,
          background: confirmed ? brandColors.primary : undefined,
          borderColor: confirmed ? brandColors.primary : undefined,
        }}
      >
        完成设置
      </Button>
    </>
  );
};
