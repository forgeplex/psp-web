"use client";

import React from "react";
import { cn } from "@psp/shared/utils/cn";
import { ChevronRight } from "lucide-react";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-slate-900 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-900 font-medium">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
