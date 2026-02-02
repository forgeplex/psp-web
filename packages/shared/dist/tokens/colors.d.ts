/**
 * PSP Color System
 * Converted from UIUX SYSTEM-DESIGN.md CSS variables to Ant Design Theme Token format.
 *
 * Source uses HSL CSS variables (e.g. "142 76% 36%").
 * We convert them to hex for Ant Design's token system.
 */
export declare const baseColors: {
    readonly background: "#FFFFFF";
    readonly foreground: "#0A0A0B";
    readonly card: "#FFFFFF";
    readonly cardForeground: "#0A0A0B";
    readonly primary: "#18181B";
    readonly primaryForeground: "#FAFAFA";
    readonly secondary: "#F4F4F5";
    readonly secondaryForeground: "#18181B";
    readonly muted: "#F4F4F5";
    readonly mutedForeground: "#71717A";
    readonly accent: "#F4F4F5";
    readonly accentForeground: "#18181B";
    readonly destructive: "#EF4444";
    readonly destructiveForeground: "#FAFAFA";
    readonly border: "#E4E4E7";
    readonly input: "#E4E4E7";
    readonly ring: "#18181B";
};
export declare const statusColors: {
    readonly success: "#22C55E";
    readonly successBg: "#F0FDF4";
    readonly pending: "#F59E0B";
    readonly pendingBg: "#FFFBEB";
    readonly failed: "#EF4444";
    readonly failedBg: "#FEF2F2";
    readonly refunded: "#A855F7";
    readonly refundedBg: "#FAF5FF";
    readonly healthGood: "#22C55E";
    readonly healthWarning: "#F59E0B";
    readonly healthCritical: "#EF4444";
    readonly amountPositive: "#22C55E";
    readonly amountNegative: "#EF4444";
};
export declare const statusConfigMap: {
    readonly success: {
        readonly color: "#22C55E";
        readonly bg: "#F0FDF4";
        readonly label: "成功";
    };
    readonly pending: {
        readonly color: "#F59E0B";
        readonly bg: "#FFFBEB";
        readonly label: "处理中";
    };
    readonly failed: {
        readonly color: "#EF4444";
        readonly bg: "#FEF2F2";
        readonly label: "失败";
    };
    readonly refunded: {
        readonly color: "#A855F7";
        readonly bg: "#FAF5FF";
        readonly label: "已退款";
    };
    readonly unknown: {
        readonly color: "#71717A";
        readonly bg: "#F4F4F5";
        readonly label: "未知";
    };
};
export type TransactionStatus = keyof typeof statusConfigMap;
export declare const brandColors: {
    readonly primary: "#6366F1";
    readonly primaryHover: "#4F46E5";
    readonly primaryLight: "#EEF2FF";
    readonly secondary: "#8B5CF6";
    readonly tertiary: "#A855F7";
    readonly gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)";
    readonly gradientSimple: "linear-gradient(135deg, #6366F1, #8B5CF6)";
};
//# sourceMappingURL=colors.d.ts.map