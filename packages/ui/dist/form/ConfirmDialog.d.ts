export interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export declare function ConfirmDialog({ open, title, description, confirmText, cancelText, danger, loading, onConfirm, onCancel, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConfirmDialog.d.ts.map