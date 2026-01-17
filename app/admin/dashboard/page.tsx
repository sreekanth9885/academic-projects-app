"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  CheckCircle,
  Clock
} from "lucide-react";
import { API_BASE } from "@/app/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface RecentOrder {
  customer_name: string;
  project_title: string;
  amount: number;
  status: string;
}

interface DashboardStats {
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  success_orders: number;
  pending_orders: number;
  average_order_value: number;
  recent_orders: RecentOrder[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`${API_BASE}/dashboard-stats.php`)
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="text-red-500">Failed to load dashboard</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={<ShoppingCart />}
        />
        <StatCard
          title="Customers"
          value={stats.total_customers}
          icon={<Users />}
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.total_revenue}`}
          icon={<IndianRupee />}
        />
        <StatCard
          title="Successful Orders"
          value={stats.success_orders}
          icon={<CheckCircle />}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending_orders}
          icon={<Clock />}
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Order Value */}
        {/* Average Order Value */}
{/* Revenue Trend */}
<div className="bg-white rounded-2xl p-6 shadow">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">Revenue Trend</p>
      <p className="text-lg font-semibold">
        Last {stats.recent_orders.length} Orders
      </p>
    </div>

    <p className="text-sm text-gray-500">
      Avg ₹{stats.average_order_value}
    </p>
  </div>

  <div className="h-56">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={[...stats.recent_orders].reverse()}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="created_at"
          tickFormatter={(v) =>
            new Date(v).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short"
            })
          }
          tick={{ fontSize: 12 }}
        />

        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `₹${v}`}
        />

        <Tooltip
  formatter={(value?: number) => [
    `₹${value ?? 0}`,
    "Amount"
  ]}
  labelFormatter={(label) =>
    new Date(label as string).toLocaleDateString("en-IN")
  }
/>

        <Line
          type="monotone"
          dataKey="amount"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>



        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          <div className="space-y-3">
            {stats.recent_orders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders</p>
            ) : (
              stats.recent_orders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  <div>
                    <p className="font-medium">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.project_title}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{order.amount}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
