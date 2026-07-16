"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  Calendar,
  ChevronRight,
  X,
  Eye,
  TrendingUp,
  Hash,
  User,
} from "lucide-react";

export default function AdminTrackingPage() {
  const [trackings, setTrackings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    loadTracking();
  }, []);

  async function loadTracking() {
    try {
      const res = await fetch("/api/admin/tracking");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setTrackings(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter & search
  const filtered = useMemo(() => {
    return trackings
      .filter((item) => {
        const matchSearch =
          search === "" ||
          item.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
          item.location?.toLowerCase().includes(search.toLowerCase()) ||
          item.courier_name?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = activeFilter === "all" || item.status === activeFilter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.tracked_at).getTime() - new Date(a.tracked_at).getTime();
        if (sortBy === "oldest")
          return new Date(a.tracked_at).getTime() - new Date(b.tracked_at).getTime();
        return 0;
      });
  }, [trackings, search, activeFilter, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: trackings.length,
      assigned: trackings.filter((t) => t.status === "assigned").length,
      pickedUp: trackings.filter((t) => t.status === "picked_up").length,
      inTransit: trackings.filter((t) => t.status === "in_transit").length,
      arrivedAtBranch: trackings.filter((t) => t.status === "arrived_at_branch").length,
      outForDelivery: trackings.filter((t) => t.status === "out_for_delivery").length,
      delivered: trackings.filter((t) => t.status === "delivered").length,
    };
  }, [trackings]);

  // Status config
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Ditugaskan", dot: "bg-blue-500" },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Diambil", dot: "bg-indigo-500" },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500" },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: Building2, label: "Tiba di Cabang", dot: "bg-orange-500" },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500" },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500" },
  };

  // Filter tabs
  const filterTabs = [
    { key: "all", label: "Semua", count: stats.total },
    { key: "assigned", label: "Ditugaskan", count: stats.assigned },
    { key: "picked_up", label: "Diambil", count: stats.pickedUp },
    { key: "in_transit", label: "Perjalanan", count: stats.inTransit },
    { key: "arrived_at_branch", label: "Tiba Cabang", count: stats.arrivedAtBranch },
    { key: "out_for_delivery", label: "Pengantaran", count: stats.outForDelivery },
    { key: "delivered", label: "Terkirim", count: stats.delivered },
  ];

  return (
    <div className="space-y-6">
      {/* ============ HEADER ============ */}
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link href="/admin/dashboard" className="hover:text-red-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-semibold">Tracking</span>
        </div>

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Tracking Shipment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Riwayat seluruh tracking paket di cabang Anda
          </p>
        </div>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Clock className="text-red-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Tracking</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Truck className="text-purple-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
              Aktif
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Dalam Perjalanan</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.inTransit}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-pink-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <MapPin className="text-pink-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded-md">
              Delivery
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Pengantaran</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.outForDelivery}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Terkirim</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.delivered}</h3>
        </div>
      </div>

      {/* ============ TRACKING TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Semua Tracking</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {filtered.length} dari {trackings.length} tracking
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari resi, lokasi, kurir..."
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
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeFilter === tab.key
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    activeFilter === tab.key
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
            <p className="text-gray-500 font-medium">Memuat data tracking...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search || activeFilter !== "all"
                ? "Tidak ada tracking ditemukan"
                : "Belum ada tracking"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search || activeFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian Anda"
                : "Tracking akan muncul saat ada update status pengiriman"}
            </p>
            {search || activeFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
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
                    No. Resi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kurir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((tracking) => {
                  const status = statusConfig[tracking.status] || statusConfig.assigned;
                  const StatusIcon = status.icon;

                  return (
                    <tr key={tracking.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Hash size={16} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {tracking.tracking_number}
                            </p>
                            <p className="text-xs text-gray-500">Nomor Resi</p>
                          </div>
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
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {tracking.location}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tracking.courier_name ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {tracking.courier_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {tracking.courier_name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(tracking.tracked_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 ml-5">
                          {new Date(tracking.tracked_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/shipments/${tracking.shipment_id}`}
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