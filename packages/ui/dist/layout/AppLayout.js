import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Layout } from 'antd';
import { layout } from '@psp/shared';
const { Header, Sider, Content } = Layout;
export function AppLayout({ children, sidebar, header, logo, defaultCollapsed = false, }) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    return (_jsxs(Layout, { style: { minHeight: '100vh' }, children: [_jsxs(Header, { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    height: layout.headerHeight,
                    lineHeight: `${layout.headerHeight}px`,
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #E4E4E7',
                    background: '#FFFFFF',
                }, children: [logo && _jsx("div", { style: { marginRight: 24 }, children: logo }), header] }), _jsxs(Layout, { style: { marginTop: layout.headerHeight }, children: [_jsx(Sider, { collapsible: true, collapsed: collapsed, onCollapse: setCollapsed, width: layout.sidebarWidth, collapsedWidth: layout.sidebarCollapsedWidth, style: {
                            position: 'fixed',
                            left: 0,
                            top: layout.headerHeight,
                            bottom: 0,
                            overflow: 'auto',
                            background: '#FFFFFF',
                            borderRight: '1px solid #E4E4E7',
                        }, theme: "light", children: sidebar }), _jsx(Content, { style: {
                            marginLeft: collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth,
                            padding: layout.pagePadding,
                            transition: 'margin-left 0.2s',
                            minHeight: `calc(100vh - ${layout.headerHeight}px)`,
                        }, children: children })] })] }));
}
//# sourceMappingURL=AppLayout.js.map