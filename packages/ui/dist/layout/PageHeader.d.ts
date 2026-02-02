import React from 'react';
export interface BreadcrumbItem {
    title: string;
    href?: string;
}
export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumb?: BreadcrumbItem[];
    extra?: React.ReactNode;
}
export declare function PageHeader({ title, subtitle, breadcrumb, extra }: PageHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PageHeader.d.ts.map