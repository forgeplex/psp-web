import { jsx as _jsx } from "react/jsx-runtime";
import { Table } from 'antd';
export function DataTable({ selectable = false, selectedRowKeys, onSelectionChange, onTableChange, pagination, ...rest }) {
    const defaultPagination = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        ...(typeof pagination === 'object' ? pagination : {}),
    };
    return (_jsx(Table, { rowSelection: selectable
            ? {
                selectedRowKeys,
                onChange: (keys, rows) => onSelectionChange?.(keys, rows),
            }
            : undefined, pagination: pagination === false ? false : defaultPagination, onChange: onTableChange, size: "middle", style: { borderRadius: 8, overflow: 'hidden' }, ...rest }));
}
//# sourceMappingURL=DataTable.js.map