import { createFileRoute } from '@tanstack/react-router';
import { Card, Descriptions, Typography, Tag, Space } from 'antd';
import { CodeOutlined, ClockCircleOutlined } from '@ant-design/icons';

export const Route = createFileRoute('/version')({
  component: VersionPage,
});

function VersionPage() {
  const gitCommit = import.meta.env.VITE_GIT_COMMIT || 'development';
  const buildTime = import.meta.env.VITE_BUILD_TIME || '-';
  const isDev = gitCommit === 'development';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: 24,
    }}>
      <Card 
        title={
          <Space>
            <CodeOutlined />
            <span>Version Info</span>
          </Space>
        }
        style={{ width: '100%', maxWidth: 480 }}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Git Commit">
            {isDev ? (
              <Tag color="orange">development</Tag>
            ) : (
              <Typography.Text code copyable>
                {gitCommit}
              </Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Build Time">
            <Space>
              <ClockCircleOutlined />
              <span>{buildTime}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="App">
            <Tag color="blue">checkout</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
