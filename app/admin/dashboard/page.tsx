"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  Users,
  Truck,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  DollarSign,
  MapPin,
  BarChart3,
  Zap,
  FileText,
  UserPlus,
  Eye,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setDashboard(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Status config
  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
    unpaid: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Belum Dibayar" },
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Ditugaskan" },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Diambil" },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan" },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: MapPin, label: "Tiba di Cabang" },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran" },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Dibatalkan" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
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

  // Stats cards data
  const stats = [
    {
      label: "Total Shipment",
      value: dashboard.totalShipment || 0,
      icon: Package,
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Pending Payment",
      value: dashboard.pendingPayment || 0,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
      trend: "+3",
      trendUp: true,
    },
    {
      label: "Assigned",
      value: dashboard.assigned || 0,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "+5",
      trendUp: true,
    },
    {
      label: "Delivered",
      value: dashboard.delivered || 0,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Total Kurir",
      value: dashboard.totalCourier || 0,
      icon: Truck,
      color: "from-indigo-500 to-indigo-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      trend: "+2",
      trendUp: true,
    },
    {
      label: "Shipment Hari Ini",
      value: dashboard.todayShipment || 0,
      icon: Zap,
      color: "from-orange-500 to-red-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "Hari ini",
      trendUp: true,
    },
  ];

  // Quick actions
  const quickActions = [
    { icon: Plus, label: "Buat Shipment", href: "/admin/shipments/create", color: "bg-red-600" },
    { icon: Users, label: "Kelola Kurir", href: "/admin/courier-applications", color: "bg-purple-600" },
    { icon: Search, label: "Lacak Paket", href: "/admin/tracking", color: "bg-orange-500" },
    { icon: FileText, label: "Laporan", href: "/admin/reports", color: "bg-blue-600" },
  ];

  // Mock monthly data for chart
  const monthlyData = dashboard.monthlyStats || [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 62 },
    { month: "Mar", value: 58 },
    { month: "Apr", value: 78 },
    { month: "Mei", value: 85 },
    { month: "Jun", value: 92 },
  ];
  const maxMonthly = Math.max(...monthlyData.map((d: any) => d.value));

  return (
    <div className="space-y-6">
      {/* ============ WELCOME BANNER ============ */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
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
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl" />

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
              Selamat Datang, Admin 👋
            </h1>
            <p className="text-white/90 text-sm lg:text-base max-w-lg">
              Pantau operasional cabang dan kelola pengiriman dengan mudah dari dashboard ini.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/shipments"
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Eye size={18} />
              <span>Lihat Semua</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============ STATS CARDS ============ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Statistik Operasional</h2>
            <p className="text-sm text-gray-500">Ringkasan performa cabang Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
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
                    <span>{stat.trend}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {Number(stat.value).toLocaleString("id-ID")}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ QUICK ACTIONS + CHART ============ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Aksi Cepat</h2>
              <p className="text-sm text-gray-500">Shortcut operasional</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 border border-transparent hover:border-red-200 transition-all"
                >
                  <div
                    className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="text-white" size={20} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Statistik Pengiriman</h2>
              <p className="text-sm text-gray-500">6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-orange-500 rounded" />
                <span className="text-gray-600">Pengiriman</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {monthlyData.map((item: any, index: number) => {
              const height = (item.value / maxMonthly) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-red-500 to-orange-400 rounded-t-lg hover:from-red-600 hover:to-orange-500 transition-all cursor-pointer relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.value} paket
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ RECENT SHIPMENTS ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shipment Terbaru</h2>
              <p className="text-sm text-gray-500">
                {dashboard.latest?.length || 0} shipment terbaru di cabang Anda
              </p>
            </div>

            <Link
              href="/admin/shipments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Lihat Semua
              <ChevronRight size={16} />
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ongkir
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboard.latest?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">Belum ada shipment</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Shipment terbaru akan muncul di sini
                    </p>
                  </td>
                </tr>
              ) : (
                dashboard.latest?.map((shipment: any) => {
                  const status = statusConfig[shipment.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={shipment.tracking_number} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Package size={16} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {shipment.tracking_number}
                            </p>
                            <p className="text-xs text-gray-500">Nomor Resi</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {Number(shipment.total_price).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {new Date(shipment.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(shipment.created_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/shipments/${shipment.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          Detail
                          <ArrowUpRight size={14} />
                        </Link>
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