import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Drawer, Descriptions } from 'antd';
export function DetailDrawer({ fields, descriptionProps, children, extra, ...drawerProps }) {
    return (_jsxs(Drawer, { width: 640, placement: "right", destroyOnHidden: true, extra: extra, ...drawerProps, children: [fields && fields.length > 0 && (_jsx(Descriptions, { column: 2, bordered: true, size: "small", ...descriptionProps, items: fields.map((field) => ({
                    label: field.label,
                    children: field.value,
                    span: field.span,
                })) })), children] }));
}
//# sourceMappingURL=DetailDrawer.js.map