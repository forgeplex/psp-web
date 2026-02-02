import { baseColors, statusColors } from './colors';
import { fontFamily, fontSize } from './typography';
import { borderRadius } from './spacing';
export const pspTheme = {
    token: {
        // Colors
        colorPrimary: baseColors.primary,
        colorSuccess: statusColors.success,
        colorWarning: statusColors.pending,
        colorError: statusColors.failed,
        colorInfo: '#3B82F6',
        // Background
        colorBgContainer: baseColors.background,
        colorBgLayout: '#F5F5F5',
        colorBgElevated: baseColors.card,
        // Text
        colorText: baseColors.foreground,
        colorTextSecondary: baseColors.mutedForeground,
        // Border
        colorBorder: baseColors.border,
        colorBorderSecondary: '#F0F0F0',
        // Typography
        fontFamily: fontFamily.sans,
        fontFamilyCode: fontFamily.mono,
        fontSize: fontSize.sm,
        // Border Radius
        borderRadius: borderRadius.md,
        borderRadiusLG: borderRadius.lg,
        borderRadiusSM: borderRadius.sm,
        // Sizing
        controlHeight: 36,
        controlHeightLG: 40,
        controlHeightSM: 28,
    },
    components: {
        Layout: {
            headerBg: baseColors.background,
            headerHeight: 56,
            siderBg: baseColors.background,
            bodyBg: '#F5F5F5',
        },
        Table: {
            headerBg: baseColors.muted,
            rowHoverBg: '#FAFAFA',
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
        },
        Menu: {
            itemHeight: 40,
            itemBorderRadius: borderRadius.md,
            subMenuItemBorderRadius: borderRadius.md,
        },
        Card: {
            paddingLG: 24,
        },
        Button: {
            controlHeight: 36,
            controlHeightLG: 40,
            controlHeightSM: 28,
        },
    },
};
//# sourceMappingURL=antd-theme.js.map