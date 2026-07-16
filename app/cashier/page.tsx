"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  AlertCircle,
  Package,
  Users,
  ArrowUpRight,
  Eye,
  Receipt,
  Wallet,
  PiggyBank,
  BarChart3,
  Plus,
  ChevronRight, // ✅ Ditambahkan di sini
} from "lucide-react";

export default function CashierDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/cashier/dashboard");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat dashboard cashier...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 mb-6">Terjadi kesalahan saat memuat dashboard.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Calculate success rate
  const successRate = Math.round(
    (stats.total_paid / Math.max(stats.total_payment, 1)) * 100
  );

  // Stats cards data
  const statsCards = [
    {
      label: "Pending Payment",
      value: stats.pending || 0,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
      trend: "Perlu ditindaklanjuti",
      trendUp: false,
    },
    {
      label: "Paid Today",
      value: stats.paid_today || 0,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      trend: "Hari ini",
      trendUp: true,
    },
    {
      label: "Revenue Today",
      value: `Rp ${Number(stats.revenue_today || 0).toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
      trend: "Pendapatan hari ini",
      trendUp: true,
    },
    {
      label: "Revenue Month",
      value: `Rp ${Number(stats.revenue_month || 0).toLocaleString("id-ID")}`,
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "Pendapatan bulan ini",
      trendUp: true,
    },
    {
      label: "Total Payment",
      value: stats.total_payment || 0,
      icon: Receipt,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "Total transaksi",
      trendUp: true,
    },
    {
      label: "Total Paid",
      value: stats.total_paid || 0,
      icon: PiggyBank,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      trend: "Pembayaran sukses",
      trendUp: true,
    },
    {
      label: "Total Pending",
      value: stats.total_pending || 0,
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "Menunggu pembayaran",
      trendUp: false,
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: BarChart3,
      color: successRate >= 80 ? "from-green-500 to-green-600" : "from-yellow-500 to-orange-500",
      bgLight: successRate >= 80 ? "bg-green-50" : "bg-yellow-50",
      textColor: successRate >= 80 ? "text-green-600" : "text-yellow-600",
      trend: successRate >= 80 ? "Performa baik" : "Perlu ditingkatkan",
      trendUp: successRate >= 80,
    },
  ];

  // Quick actions
  const quickActions = [
    { icon: CreditCard, label: "Proses Pembayaran", href: "/cashier/payments", color: "bg-red-600" },
    { icon: Eye, label: "Lihat Semua", href: "/cashier/payments", color: "bg-blue-600" },
    { icon: Receipt, label: "Laporan", href: "/cashier/reports", color: "bg-purple-600" },
    { icon: Users, label: "Customer", href: "/cashier/customers", color: "bg-green-600" },
  ];

  // Mock monthly revenue data
  const monthlyData = stats.monthlyRevenue || [
    { month: "Jan", value: 5000000 },
    { month: "Feb", value: 7200000 },
    { month: "Mar", value: 6800000 },
    { month: "Apr", value: 8500000 },
    { month: "Mei", value: 9200000 },
    { month: "Jun", value: 10500000 },
  ];
  const maxMonthly = Math.max(...monthlyData.map((d: any) => d.value));

  // Payment status config
  const paymentStatusConfig: Record<string, { bg: string; text: string; icon: any; label: string; dot: string }> = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas", dot: "bg-green-500" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending", dot: "bg-yellow-500" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal", dot: "bg-red-500" },
  };

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/cashier" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Overview</span>
      </div>

      {/* ============ WELCOME BANNER ============ */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-800 rounded-full opacity-30 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Calendar size={12} />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Selamat Datang, Cashier 👋
            </h1>
            <p className="text-white/90 text-sm lg:text-base max-w-lg">
              Pantau semua pembayaran dan kelola transaksi dengan mudah dari dashboard ini.
            </p>
          </div>

          <Link
            href="/cashier/payments"
            className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-xl whitespace-nowrap flex items-center gap-2"
          >
            <CreditCard size={18} />
            <span>Proses Pembayaran</span>
          </Link>
        </div>
      </div>

      {/* ============ STATS CARDS ============ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Statistik Pembayaran</h2>
            <p className="text-sm text-gray-500">Ringkasan performa pembayaran</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgLight} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={stat.textColor} size={22} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                      stat.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-2">{stat.trend}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ RECENT PAYMENTS ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pembayaran Terbaru</h2>
              <p className="text-sm text-gray-500">
                {stats.recent?.length || 0} transaksi terbaru
              </p>
            </div>

            <Link
              href="/cashier/payments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Lihat Semua
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  No. Resi
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jumlah
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
              {stats.recent?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CreditCard className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">Belum ada pembayaran</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Pembayaran terbaru akan muncul di sini
                    </p>
                  </td>
                </tr>
              ) : (
                stats.recent?.map((item: any) => {
                  const status = paymentStatusConfig[item.payment_status] || paymentStatusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Package size={16} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {item.tracking_number}
                            </p>
                            <p className="text-xs text-gray-500">Nomor Resi</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.customer_name?.charAt(0).toUpperCase() || "C"}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {item.customer_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {Number(item.amount).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={14} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}