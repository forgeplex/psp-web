# Transactions 模块

## 功能列表

### 页面
- `TransactionListPage` - 交易列表（搜索/筛选/分页）
- `TransactionDetailPage` - 交易详情（4 Tabs）

### 组件
- `TransactionTimeline` - 状态时间线（自动降级）
- `TransactionStatusBadge` - 状态标签
- `TransactionFilters` - 筛选组件
- `ExportModal` - 导出配置
- `RefundModal` - 退款申请
- `CancelModal` - 取消交易

### Hooks
- `useTransactions` - 交易列表查询
- `useTransaction` - 交易详情查询
- `useTransactionTimeline` - 时间线查询（自动降级）

## API 路径

```
GET    /api/v1/transactions              - 列表
GET    /api/v1/transactions/:id          - 详情
GET    /api/v1/transactions/:id/timeline - 时间线 ⏳
POST   /api/v1/transactions/export       - 导出
POST   /api/v1/refunds                   - 退款
POST   /api/v1/cancels                   - 取消
```

## Timeline 降级逻辑

```typescript
// 1. 尝试真实 API
try {
  return await apiClient.get(`/api/v1/transactions/${id}/timeline`);
} catch (err) {
  // 2. 404 时使用 mock 数据
  if (err.response?.status === 404) {
    return mockTimelineData[id];
  }
  throw err;
}
```

部署成功后自动切换，无需人工干预！
