import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Space, Button, Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
export function FilterBar({ children, searchPlaceholder = '搜索...', searchValue, onSearchChange, onSearch, onReset, extra, }) {
    return (_jsxs("div", { style: {
            padding: '16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
        }, children: [_jsxs(Space, { wrap: true, size: 12, children: [_jsx(Input.Search, { placeholder: searchPlaceholder, prefix: _jsx(SearchOutlined, {}), value: searchValue, onChange: (e) => onSearchChange?.(e.target.value), onSearch: onSearch, style: { width: 280 }, allowClear: true }), children, onReset && (_jsx(Button, { icon: _jsx(ReloadOutlined, {}), onClick: onReset, children: "\u91CD\u7F6E" }))] }), extra && _jsx(Space, { children: extra })] }));
}
//# sourceMappingURL=FilterBar.js.map