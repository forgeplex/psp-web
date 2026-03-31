"use client";

import React from "react";
import { cn } from "@psp/shared/utils/cn";
import {
  LayoutDashboard,
  CreditCard,
  RefreshCw,
  Key,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

export interface AppShellProps {
  children: React.ReactNode;
  currentPath?: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Transactions", href: "/transactions" },
  { icon: <RefreshCw className="w-5 h-5" />, label: "Subscriptions", href: "/subscriptions" },
  { icon: <Key className="w-5 h-5" />, label: "API Keys", href: "/api-keys" },
];

export function AppShell({ children, currentPath = "/dashboard" }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-slate-900">VeloPays</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 -ml-[2px] pl-[14px]"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.icon}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-200 space-y-1">
          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </a>
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Acme Corp</p>
              <p className="text-xs text-slate-500 truncate">admin@acme.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">
              {navItems.find((i) => i.href === currentPath)?.label || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              AC
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
