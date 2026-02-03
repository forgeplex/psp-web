import { Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface FilterValues {
  keyword?: string;
  status?: string;
  type?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

interface TransactionFiltersProps {
  onSearch: (values: FilterValues) => void;
  onReset: () => void;
  loading?: boolean;
}

export function TransactionFilters({ onSearch, onReset, loading }: TransactionFiltersProps) {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form
      form={form}
      layout="inline"
      style={{ marginBottom: 16 }}
    >
      <Form.Item name="keyword" label="关键词">
        <Input
          placeholder="订单号/用户ID"
          allowClear
          style={{ width: 200 }}
        />
      </Form.Item>

      <Form.Item name="status" label="状态">
        <Select
          placeholder="选择状态"
          allowClear
          style={{ width: 140 }}
        >
          <Option value="PENDING">待支付</Option>
          <Option value="PAID">已支付</Option>
          <Option value="COMPLETED">已完成</Option>
          <Option value="FAILED">失败</Option>
          <Option value="EXPIRED">已过期</Option>
          <Option value="CLOSED">已关闭</Option>
          <Option value="PARTIALLY_REFUNDED">部分退款</Option>
          <Option value="FULLY_REFUNDED">全额退款</Option>
        </Select>
      </Form.Item>

      <Form.Item name="type" label="类型">
        <Select
          placeholder="选择类型"
          allowClear
          style={{ width: 120 }}
        >
          <Option value="PAYMENT">支付</Option>
          <Option value="REFUND">退款</Option>
          <Option value="TRANSFER">转账</Option>
        </Select>
      </Form.Item>

      <Form.Item name="dateRange" label="时间范围">
        <RangePicker
          style={{ width: 240 }}
          placeholder={['开始日期', '结束日期']}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default TransactionFilters;
