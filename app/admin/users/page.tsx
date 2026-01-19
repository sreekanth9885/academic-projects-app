"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  Mail,
  Phone,
  IndianRupee,
  BookOpen,
  Search
} from "lucide-react";
import { API_BASE } from "@/app/constants";

interface CustomerOrder {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  project_title: string;
  amount: number;
  status: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch(`${API_BASE}/get-customers.php`)
      .then(res => setOrders(res.customers || []))
      .finally(() => setLoading(false));
  }, []);

  /* 🔍 FILTER FIRST (ENTIRE DATASET) */
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;

    return orders.filter(o =>
      o.customer_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [orders, search]);

  /* 📄 PAGINATE AFTER FILTER */
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  /* Reset page when search changes */
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Orders</h1>

        {/* 🔍 Search */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading orders...</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.map((o, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 align-top">
                      <div className="font-medium">
                        {o.customer_name || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Mail className="w-4 h-4" />
                        {o.customer_email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Phone className="w-4 h-4" />
                        {o.customer_phone || "—"}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 font-medium">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        {o.project_title}
                      </div>
                    </td>

                    <td className="p-4 align-top font-semibold">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {o.amount}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          o.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No matching customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
