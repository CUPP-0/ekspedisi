"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  Users,
  UserCog,
  Building2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Clock,
  AlertCircle,
  ChevronRight,
  Eye,
  Hash,
  MapPin,
} from "lucide-react";

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/manager/dashboard");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setStats(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat dashboard manager...</p>
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

  // Stats cards data
  const statsCards = [
    {
      label: "Total Shipment",
      value: stats.shipment || 0,
      icon: Package,
      bgLight: "bg-red-50",
      textColor: "text-red-600",
      trend: "Semua pengiriman",
      trendUp: true,
    },
    {
      label: "Shipment Hari Ini",
      value: stats.shipment_today || 0,
      icon: Truck,
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "Pengiriman hari ini",
      trendUp: true,
    },
    {
      label: "Total Customer",
      value: stats.customer || 0,
      icon: Users,
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "Pelanggan terdaftar",
      trendUp: true,
    },
    {
      label: "Total Kurir",
      value: stats.courier || 0,
      icon: UserCog,
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "Mitra kurir aktif",
      trendUp: true,
    },
    {
      label: "Total Cabang",
      value: stats.branch || 0,
      icon: Building2,
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      trend: "Cabang terdaftar",
      trendUp: true,
    },
    {
      label: "Delivered",
      value: stats.delivered || 0,
      icon: CheckCircle2,
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      trend: "Paket terkirim",
      trendUp: true,
    },
    {
      label: "In Transit",
      value: stats.transit || 0,
      icon: Truck,
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-600",
      trend: "Sedang dikirim",
      trendUp: true,
    },
    {
      label: "Total Revenue",
      value: `Rp ${Number(stats.revenue || 0).toLocaleString("id-ID")}`,
      icon: DollarSign,
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      trend: "Pendapatan total",
      trendUp: true,
    },
  ];

  // Status config untuk recent shipments
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending", dot: "bg-yellow-500" },
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Ditugaskan", dot: "bg-blue-500" },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Diambil", dot: "bg-indigo-500" },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500" },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: MapPin, label: "Tiba di Cabang", dot: "bg-orange-500" },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500" },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Dibatalkan", dot: "bg-red-500" },
  };

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-gray-900 font-semibold">Dashboard</span>
      </div>

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
              Selamat Datang, Manager 👋
            </h1>
            <p className="text-white/90 text-sm lg:text-base max-w-lg">
              Pantau operasional seluruh cabang dan kelola sistem ekspedisi dari dashboard ini.
            </p>
          </div>

          <Link
            href="/manager/shipments"
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Truck size={18} />
            <span>Lihat Shipments</span>
          </Link>
        </div>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Statistik Sistem</h2>
            <p className="text-sm text-gray-500">Ringkasan data operasional</p>
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

      {/* ============ RECENT SHIPMENTS ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shipment Terbaru</h2>
              <p className="text-sm text-gray-500">
                {stats.recent?.length || 0} shipment terbaru di seluruh cabang
              </p>
            </div>

            <Link
              href="/manager/shipments"
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
                  Pengirim
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Penerima
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
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
              {stats.recent?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">Belum ada shipment</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Shipment terbaru akan muncul di sini
                    </p>
                  </td>
                </tr>
              ) : (
                stats.recent?.map((item: any) => {
                  const status = statusConfig[item.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Hash size={16} className="text-red-600" />
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
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.sender_name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.sender_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.receiver_name?.charAt(0).toUpperCase() || "R"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.receiver_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/manager/shipments/${item.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={14} />
                          Detail
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