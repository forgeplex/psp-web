import React, { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';

export interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
}

export interface AppShellProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
  navItems: NavItem[];
  activeKey?: string;
  headerRight?: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function AppShell({
  children,
  logo,
  navItems,
  activeKey,
  headerRight,
  defaultCollapsed = false,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
          transition-all duration-200 ease-in-out z-50
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-3 overflow-hidden">
            {logo || (
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">V</span>
              </div>
            )}
            {!collapsed && (
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                VeloPays
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <a
                key={item.key}
                href={item.href || '#'}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content Area */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen
          transition-all duration-200 ease-in-out
          ${collapsed ? 'ml-16' : 'ml-60'}
        `}
      >
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            {navItems.find(n => n.key === activeKey)?.label || 'Dashboard'}
          </h1>
          {headerRight && (
            <div className="flex items-center gap-4">
              {headerRight}
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
