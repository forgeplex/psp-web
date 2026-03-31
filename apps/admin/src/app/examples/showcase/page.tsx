"use client";

import React, { useState } from "react";
import {
  AppShell,
  KpiCard,
  DataTable,
  StatusBadge,
  PageHeader,
  FilterBar,
  Column,
  StatusType,
} from "@psp/ui/velopays";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  CreditCard,
  RefreshCw,
  Settings,
} from "lucide-react";

// Sample data for DataTable
interface SampleData {
  id: string;
  name: string;
  status: StatusType;
  amount: string;
}

const sampleData: SampleData[] = [
  { id: "1", name: "Item One", status: "success", amount: "$100" },
  { id: "2", name: "Item Two", status: "pending", amount: "$200" },
  { id: "3", name: "Item Three", status: "failed", amount: "$50" },
];

const sampleColumns: Column<SampleData>[] = [
  { key: "id", header: "ID", width: "80px" },
  { key: "name", header: "Name" },
  { key: "amount", header: "Amount", align: "right", width: "100px" },
  {
    key: "status",
    header: "Status",
    width: "120px",
    render: (item) => <StatusBadge status={item.status} />,
  },
];

export default function ComponentsShowcasePage() {
  const [activeTab, setActiveTab] = useState("kpis");
  const [page, setPage] = useState(1);

  const tabs = [
    { id: "kpis", label: "KpiCard" },
    { id: "status", label: "StatusBadge" },
    { id: "tables", label: "DataTable" },
    { id: "filters", label: "FilterBar" },
    { id: "headers", label: "PageHeader" },
  ];

  return (
    <AppShell currentPath="/examples/showcase">
      <PageHeader
        title="Components Showcase"
        description="Display all component variants and props combinations"
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-12">
        {/* KpiCard Variants */}
        {activeTab === "kpis" && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              KpiCard — Icon Colors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <KpiCard
                title="Indigo"
                value="$100,000"
                icon={DollarSign}
                iconColor="indigo"
              />
              <KpiCard
                title="Emerald"
                value="2,340"
                icon={Users}
                iconColor="emerald"
              />
              <KpiCard
                title="Amber"
                value="89%"
                icon={AlertCircle}
                iconColor="amber"
              />
              <KpiCard
                title="Blue"
                value="1,200"
                icon={CreditCard}
                iconColor="blue"
              />
            </div>

            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              KpiCard — Trend Directions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard
                title="Trend Up"
                value="+24.5%"
                trend={{ value: "+24.5%", direction: "up", label: "vs last month" }}
                icon={TrendingUp}
                iconColor="emerald"
              />
              <KpiCard
                title="Trend Down"
                value="-8.2%"
                trend={{ value: "-8.2%", direction: "down", label: "vs last month" }}
                icon={TrendingDown}
                iconColor="red"
              />
              <KpiCard
                title="No Trend"
                value="1,200"
                icon={Settings}
                iconColor="indigo"
              />
            </div>
          </section>
        )}

        {/* StatusBadge Variants */}
        {activeTab === "status" && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              StatusBadge — All Variants
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 mb-2">Payment Status</p>
                  <StatusBadge status="success" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="failed" />
                  <StatusBadge status="refunded" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 mb-2">Subscription</p>
                  <StatusBadge status="active" />
                  <StatusBadge status="paused" />
                  <StatusBadge status="cancelled" />
                  <StatusBadge status="trialing" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 mb-2">Other</p>
                  <StatusBadge status="expired" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 mb-2">Custom Labels</p>
                  <StatusBadge status="success" label="Completed" />
                  <StatusBadge status="pending" label="Processing" />
                  <StatusBadge status="failed" label="Declined" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DataTable Variants */}
        {activeTab === "tables" && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              DataTable — With Pagination
            </h2>
            <DataTable
              columns={sampleColumns}
              data={sampleData}
              keyExtractor={(item) => item.id}
              pagination={{
                page,
                pageSize: 10,
                total: 45,
                onPageChange: setPage,
              }}
            />

            <h2 className="text-lg font-semibold text-slate-900 mb-6 mt-8">
              DataTable — Without Pagination
            </h2>
            <DataTable
              columns={sampleColumns}
              data={sampleData}
              keyExtractor={(item) => item.id}
            />

            <h2 className="text-lg font-semibold text-slate-900 mb-6 mt-8">
              DataTable — Clickable Rows
            </h2>
            <DataTable
              columns={sampleColumns}
              data={sampleData}
              keyExtractor={(item) => item.id}
              onRowClick={(item) => alert(`Clicked: ${item.name}`)}
            />
          </section>
        )}

        {/* FilterBar Variants */}
        {activeTab === "filters" && (
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                FilterBar — Full
              </h2>
              <FilterBar
                searchPlaceholder="Search transactions..."
                filters={[
                  {
                    key: "status",
                    label: "Status",
                    options: [
                      { label: "Success", value: "success" },
                      { label: "Pending", value: "pending" },
                      { label: "Failed", value: "failed" },
                    ],
                  },
                  {
                    key: "date",
                    label: "Date",
                    options: [
                      { label: "Today", value: "today" },
                      { label: "This Week", value: "week" },
                      { label: "This Month", value: "month" },
                    ],
                  },
                ]}
                onExport={() => console.log("Export clicked")}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                FilterBar — Search Only
              </h2>
              <FilterBar searchPlaceholder="Search..." />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                FilterBar — With Filters Only
              </h2>
              <FilterBar
                filters={[
                  {
                    key: "type",
                    label: "Type",
                    options: [
                      { label: "All", value: "" },
                      { label: "Payment", value: "payment" },
                      { label: "Refund", value: "refund" },
                    ],
                  },
                ]}
              />
            </div>
          </section>
        )}

        {/* PageHeader Variants */}
        {activeTab === "headers" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                PageHeader — With Breadcrumbs
              </h2>
              <PageHeader
                title="Transaction Details"
                description="View and manage transaction information"
                breadcrumbs={[
                  { label: "Home", href: "/" },
                  { label: "Transactions", href: "/transactions" },
                  { label: "TRX-8923" },
                ]}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                PageHeader — Simple
              </h2>
              <PageHeader
                title="Dashboard"
                description="Overview of your payment activity"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                PageHeader — With Actions
              </h2>
              <PageHeader
                title="API Keys"
                description="Manage your API credentials"
              >
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Create API Key
                </button>
              </PageHeader>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
