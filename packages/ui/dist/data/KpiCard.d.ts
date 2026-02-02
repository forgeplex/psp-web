import React from 'react';
export interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
    };
    icon?: React.ReactNode;
    loading?: boolean;
}
export declare function KpiCard({ title, value, subtitle, change, icon, loading }: KpiCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=KpiCard.d.ts.map