import React from 'react';
import { Space, Button, Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

export interface FilterBarProps {
  children?: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onReset?: () => void;
  extra?: React.ReactNode;
}

export function FilterBar({
  children,
  searchPlaceholder = '搜索...',
  searchValue,
  onSearchChange,
  onSearch,
  onReset,
  extra,
}: FilterBarProps) {
  return (
    <div
      style={{
        padding: '16px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <Space wrap size={12}>
        <Input.Search
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onSearch={onSearch}
          style={{ width: 280 }}
          allowClear
        />
        {children}
        {onReset && (
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            重置
          </Button>
        )}
      </Space>
      {extra && <Space>{extra}</Space>}
    </div>
  );
}
