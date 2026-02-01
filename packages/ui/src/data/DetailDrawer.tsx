import React from 'react';
import { Drawer, type DrawerProps, Descriptions, type DescriptionsProps } from 'antd';

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

export function DetailDrawer({
  fields,
  descriptionProps,
  children,
  extra,
  ...drawerProps
}: DetailDrawerProps) {
  return (
    <Drawer
      width={640}
      placement="right"
      destroyOnClose
      extra={extra}
      {...drawerProps}
    >
      {fields && fields.length > 0 && (
        <Descriptions
          column={2}
          bordered
          size="small"
          {...descriptionProps}
          items={fields.map((field) => ({
            label: field.label,
            children: field.value,
            span: field.span,
          }))}
        />
      )}
      {children}
    </Drawer>
  );
}
