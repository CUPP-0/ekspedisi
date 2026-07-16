"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CreditCard,
  Receipt,
  Package,
  User,
  Calendar,
  X,
  TrendingUp,
  DollarSign,
  Hash,
} from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "amount">("newest");

  useEffect(() => {
    loadPayments();
  }, [search, status]);

  async function loadPayments() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/cashier/payments?search=${search}&status=${status}`
      );

      const data = await res.json();

      if (!res.ok) {
        setPayments([]);
        return;
      }

      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  // Sort payments
  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest")
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "amount") return b.amount - a.amount;
      return 0;
    });
  }, [payments, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: payments.length,
      pending: payments.filter((p) => p.payment_status === "pending").length,
      paid: payments.filter((p) => p.payment_status === "paid").length,
      failed: payments.filter((p) => p.payment_status === "failed").length,
      expired: payments.filter((p) => p.payment_status === "expired").length,
      totalRevenue: payments
        .filter((p) => p.payment_status === "paid")
        .reduce((sum, p) => sum + Number(p.amount), 0),
    };
  }, [payments]);

  // Status config
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending", dot: "bg-yellow-500" },
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas", dot: "bg-green-500" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal", dot: "bg-red-500" },
    expired: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle, label: "Expired", dot: "bg-gray-500" },
  };

  // Filter tabs
  const filterTabs = [
    { key: "", label: "Semua", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "paid", label: "Lunas", count: stats.paid },
    { key: "failed", label: "Gagal", count: stats.failed },
    { key: "expired", label: "Expired", count: stats.expired },
  ];

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/cashier" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Pembayaran</span>
      </div>

      {/* ============ HEADER ============ */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Daftar Pembayaran
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola semua transaksi pembayaran customer
        </p>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <CreditCard className="text-red-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              Lunas
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pembayaran Lunas</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.paid}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
              Pending
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Menunggu Bayar</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">
              Gagal
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pembayaran Gagal</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.failed}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
          <h3 className="text-xl font-bold text-gray-900">
            Rp {(stats.totalRevenue / 1000000).toFixed(1)}jt
          </h3>
        </div>
      </div>

      {/* ============ PAYMENTS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Semua Pembayaran</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {sortedPayments.length} dari {payments.length} pembayaran
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari invoice, resi, customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1 min-w-0"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-gray-100 rounded-xl px-3 py-2 pr-8 text-sm font-medium text-gray-700 outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="amount">Jumlah Tertinggi</option>
                </select>
                <ArrowUpDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={16} className="text-gray-400 flex-shrink-0" />
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatus(tab.key)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  status === tab.key
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    status === tab.key
                      ? "bg-white/20"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Memuat data pembayaran...</p>
          </div>
        ) : sortedPayments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search || status
                ? "Tidak ada pembayaran ditemukan"
                : "Belum ada pembayaran"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search || status
                ? "Coba ubah filter atau kata kunci pencarian Anda"
                : "Pembayaran akan muncul di sini ketika customer melakukan transaksi"}
            </p>
            {search || status ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 font-semibold text-gray-700 hover:text-red-600 transition-all"
              >
                Reset Filter
              </button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    No. Resi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPayments.map((payment) => {
                  const statusCfg = statusConfig[payment.payment_status] || statusConfig.pending;
                  const StatusIcon = statusCfg.icon;

                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Receipt size={16} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {payment.invoice_number}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={10} />
                              {payment.created_at
                                ? new Date(payment.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {payment.tracking_number}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {payment.customer_name?.charAt(0).toUpperCase() || "C"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {payment.customer_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-1.5 rounded-lg">
                            <CreditCard size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {payment.payment_method?.replaceAll("_", " ") || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {Number(payment.amount).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/cashier/payments/${payment.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={14} />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}