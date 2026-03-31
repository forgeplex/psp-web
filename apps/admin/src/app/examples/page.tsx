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
  CreditCard,
  RefreshCw,
  Users,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

// Mock data types
interface Transaction {
  id: string;
  merchant: string;
  email: string;
  amount: string;
  status: StatusType;
  method: string;
  date: string;
}

// Mock data
const transactions: Transaction[] = [
  {
    id: "TRX-8923",
    merchant: "Acme Corporation",
    email: "billing@acme.com",
    amount: "$2,450.00",
    status: "success",
    method: "Visa •••• 4242",
    date: "Jan 15, 2024",
  },
  {
    id: "TRX-8922",
    merchant: "TechFlow Inc",
    email: "finance@techflow.io",
    amount: "$890.50",
    status: "pending",
    method: "Mastercard •••• 8888",
    date: "Jan 15, 2024",
  },
  {
    id: "TRX-8921",
    merchant: "Global Solutions",
    email: "payments@globalsol.com",
    amount: "$12,300.00",
    status: "success",
    method: "Wire Transfer",
    date: "Jan 14, 2024",
  },
  {
    id: "TRX-8920",
    merchant: "StartupXYZ",
    email: "hello@startupxyz.dev",
    amount: "$149.99",
    status: "failed",
    method: "Visa •••• 1234",
    date: "Jan 14, 2024",
  },
  {
    id: "TRX-8919",
    merchant: "Enterprise Co",
    email: "ap@enterprise.co",
    amount: "$5,670.25",
    status: "success",
    method: "Amex •••• 9999",
    date: "Jan 13, 2024",
  },
  {
    id: "TRX-8918",
    merchant: "Digital Agency",
    email: "invoices@digital.agency",
    amount: "$3,200.00",
    status: "refunded",
    method: "Visa •••• 5555",
    date: "Jan 13, 2024",
  },
  {
    id: "TRX-8917",
    merchant: "Cloud Services",
    email: "billing@cloudsvc.com",
    amount: "$850.00",
    status: "success",
    method: "Mastercard •••• 7777",
    date: "Jan 12, 2024",
  },
  {
    id: "TRX-8916",
    merchant: "Data Analytics",
    email: "payments@dataanalytics.io",
    amount: "$4,500.00",
    status: "success",
    method: "Wire Transfer",
    date: "Jan 12, 2024",
  },
];

const transactionColumns: Column<Transaction>[] = [
  {
    key: "id",
    header: "Transaction ID",
    width: "120px",
    render: (item) => (
      <span className="font-mono text-xs text-slate-500">{item.id}</span>
    ),
  },
  {
    key: "merchant",
    header: "Merchant",
    render: (item) => (
      <div>
        <p className="font-medium text-slate-900">{item.merchant}</p>
        <p className="text-xs text-slate-500">{item.email}</p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    width: "120px",
    align: "right",
    render: (item) => (
      <span className="font-mono font-medium">{item.amount}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "100px",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "method",
    header: "Payment Method",
    width: "150px",
  },
  {
    key: "date",
    header: "Date",
    width: "120px",
    render: (item) => (
      <div className="flex items-center gap-2 text-slate-600">
        <Calendar className="w-4 h-4" />
        {item.date}
      </div>
    ),
  },
];

export default function DashboardExamplePage() {
  const [page, setPage] = useState(1);

  return (
    <AppShell currentPath="/dashboard">
      <PageHeader
        title="Dashboard"
        description="Overview of your payment activity and key metrics"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Revenue"
          value="$284,520.50"
          trend={{ value: "+12.5%", direction: "up", label: "vs last month" }}
          icon={DollarSign}
          iconColor="indigo"
        />
        <KpiCard
          title="Active Subscriptions"
          value="1,284"
          trend={{ value: "+8.2%", direction: "up", label: "vs last month" }}
          icon={RefreshCw}
          iconColor="emerald"
        />
        <KpiCard
          title="Transactions"
          value="8,923"
          trend={{ value: "-2.1%", direction: "down", label: "vs last month" }}
          icon={CreditCard}
          iconColor="amber"
        />
        <KpiCard
          title="Active Customers"
          value="4,562"
          trend={{ value: "+15.3%", direction: "up", label: "vs last month" }}
          icon={Users}
          iconColor="blue"
        />
      </div>

      {/* Recent Transactions Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Transactions
          </h2>
          <a
            href="/transactions"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

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
                { label: "Refunded", value: "refunded" },
              ],
            },
            {
              key: "date",
              label: "Date Range",
              options: [
                { label: "Today", value: "today" },
                { label: "Last 7 days", value: "7d" },
                { label: "Last 30 days", value: "30d" },
                { label: "This month", value: "month" },
              ],
            },
          ]}
          onExport={() => console.log("Export")}
          className="mb-4"
        />

        <DataTable
          columns={transactionColumns}
          data={transactions}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => console.log("Clicked:", item.id)}
          pagination={{
            page,
            pageSize: 8,
            total: 156,
            onPageChange: setPage,
          }}
        />
      </div>
    </AppShell>
  );
}
