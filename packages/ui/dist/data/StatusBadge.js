import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tag } from 'antd';
import { statusConfigMap } from '@psp/shared';
export function StatusBadge({ status, label, showDot = true }) {
    const config = statusConfigMap[status] ?? statusConfigMap.unknown;
    return (_jsxs(Tag, { color: config.bg, style: {
            color: config.color,
            borderColor: config.bg,
            borderRadius: 9999,
            padding: '2px 10px',
            fontSize: 12,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
        }, children: [showDot && (_jsx("span", { style: {
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: config.color,
                    display: 'inline-block',
                } })), label ?? config.label] }));
}
//# sourceMappingURL=StatusBadge.js.map