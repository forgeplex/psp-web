import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumb, Space, Typography } from 'antd';
const { Title } = Typography;
export function PageHeader({ title, subtitle, breadcrumb, extra }) {
    return (_jsxs("div", { style: { marginBottom: 24 }, children: [breadcrumb && breadcrumb.length > 0 && (_jsx(Breadcrumb, { style: { marginBottom: 8 }, items: breadcrumb.map((item) => ({
                    title: item.href ? _jsx("a", { href: item.href, children: item.title }) : item.title,
                })) })), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Space, { direction: "vertical", size: 0, children: [typeof title === 'string' ? (_jsx(Title, { level: 4, style: { margin: 0, fontSize: 20, fontWeight: 600 }, children: title })) : (_jsx("div", { style: { fontSize: 20, fontWeight: 600 }, children: title })), subtitle && (_jsx("span", { style: { color: '#71717A', fontSize: 14 }, children: subtitle }))] }), extra && _jsx(Space, { children: extra })] })] }));
}
//# sourceMappingURL=PageHeader.js.map