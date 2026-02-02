import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Typography, Space } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
export function ConfirmDialog({ open, title = '确认操作', description, confirmText = '确认', cancelText = '取消', danger = false, loading = false, onConfirm, onCancel, }) {
    return (_jsx(Modal, { open: open, title: null, onOk: onConfirm, onCancel: onCancel, okText: confirmText, cancelText: cancelText, okButtonProps: {
            danger,
            loading,
        }, width: 420, centered: true, children: _jsxs(Space, { align: "start", size: 16, style: { padding: '8px 0' }, children: [_jsx(ExclamationCircleFilled, { style: {
                        fontSize: 22,
                        color: danger ? '#EF4444' : '#F59E0B',
                        marginTop: 2,
                    } }), _jsxs("div", { children: [_jsx(Typography.Text, { strong: true, style: { fontSize: 16 }, children: title }), description && (_jsx(Typography.Paragraph, { type: "secondary", style: { margin: '8px 0 0' }, children: description }))] })] }) }));
}
//# sourceMappingURL=ConfirmDialog.js.map