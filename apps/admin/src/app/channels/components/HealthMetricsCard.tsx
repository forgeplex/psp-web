'use client';

import React from 'react';
import { Card, Empty, Typography } from 'antd';

const { Text } = Typography;

interface Props {
  channelId: string;
}

export default function HealthMetricsCard({ channelId }: Props) {
  return (
    <div>
      <Card title="24小时成功率趋势" style={{ marginBottom: 16 }}>
        <Empty description="图表组件占位 - 将集成 Recharts 折线图" />
        <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
          展示近24小时每小时成功率变化趋势
        </Text>
      </Card>
      
      <Card title="响应时间趋势" style={{ marginBottom: 16 }}>
        <Empty description="图表组件占位 - 将集成 Recharts 面积图" />
        <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
          展示近24小时平均响应时间变化
        </Text>
      </Card>
      
      <Card title="告警记录">
        <Empty description="暂无告警记录" />
      </Card>
    </div>
  );
}
