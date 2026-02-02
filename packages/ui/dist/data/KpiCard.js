import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Skeleton, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { statusColors } from '@psp/shared';
export function KpiCard({ title, value, subtitle, change, icon, loading }) {
    return (_jsxs(Card, { styles: { body: { padding: 24 } }, style: { borderRadius: 8 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx(Typography.Text, { type: "secondary", style: { fontSize: 14, fontWeight: 500 }, children: title }), icon && _jsx("span", { style: { color: '#71717A' }, children: icon })] }), _jsx("div", { style: { marginTop: 8 }, children: loading ? (_jsx(Skeleton.Input, { active: true, size: "small", style: { width: 120 } })) : (_jsx("span", { style: {
                        fontSize: 24,
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                    }, children: value })) }), (subtitle || change) && (_jsxs("div", { style: { marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }, children: [change && (_jsxs("span", { style: {
                            color: change.type === 'increase'
                                ? statusColors.success
                                : statusColors.failed,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                        }, children: [change.type === 'increase' ? _jsx(ArrowUpOutlined, {}) : _jsx(ArrowDownOutlined, {}), Math.abs(change.value), "%"] })), subtitle && _jsx("span", { style: { color: '#71717A' }, children: subtitle })] }))] }));
}
//# sourceMappingURL=KpiCard.js.map