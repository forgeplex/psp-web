import React from 'react';
import { type DrawerProps, type DescriptionsProps } from 'antd';
export interface DetailField {
    label: string;
    value: React.ReactNode;
    span?: number;
}
export interface DetailDrawerProps extends Omit<DrawerProps, 'children'> {
    fields?: DetailField[];
    descriptionProps?: Omit<DescriptionsProps, 'items'>;
    children?: React.ReactNode;
    extra?: React.ReactNode;
}
export declare function DetailDrawer({ fields, descriptionProps, children, extra, ...drawerProps }: DetailDrawerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DetailDrawer.d.ts.map