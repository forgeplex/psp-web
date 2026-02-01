import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, Typography, Result } from 'antd';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5' }}>
      <Card style={{ width: 600, borderRadius: 12, textAlign: 'center' }}>
        <Result
          status="info"
          title="PSP 商户门户"
          subTitle="🚧 开发中..."
        />
      </Card>
    </div>
  );
}
