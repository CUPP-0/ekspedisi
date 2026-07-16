"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  ChevronRight,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Truck,
  MapPin,
  Calendar,
  TrendingUp,
  Hash,
  Building2,
  DollarSign,
  Weight,
} from "lucide-react";

interface Shipment {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin_branch: string;
  destination_branch: string;
  total_weight: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function ManagerShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price">("newest");

  useEffect(() => {
    loadShipments();
  }, [search, status]);

  async function loadShipments() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/manager/shipments?search=${search}&status=${status}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }

  // Sort shipments
  const sortedShipments = [...shipments].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "oldest")
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === "price") return b.total_price - a.total_price;
    return 0;
  });

  // Summary stats
  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === "pending").length,
    inTransit: shipments.filter((s) => s.status === "in_transit" || s.status === "out_for_delivery").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    totalRevenue: shipments.reduce((sum, s) => sum + Number(s.total_price), 0),
  };

  // Status config
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending", dot: "bg-yellow-500" },
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Ditugaskan", dot: "bg-blue-500" },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Diambil", dot: "bg-indigo-500" },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500" },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: Building2, label: "Tiba di Cabang", dot: "bg-orange-500" },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500" },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Dibatalkan", dot: "bg-red-500" },
  };

  // Filter tabs
  const filterTabs = [
    { key: "", label: "Semua", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "in_transit", label: "Perjalanan", count: stats.inTransit },
    { key: "delivered", label: "Terkirim", count: stats.delivered },
  ];

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/manager" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Shipments</span>
      </div>

      {/* ============ HEADER ============ */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Monitoring Shipment
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau semua pengiriman di seluruh cabang
        </p>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Package className="text-red-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Shipment</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
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
          <p className="text-sm text-gray-500 mb-1">Menunggu Proses</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
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
            <div className="bg-emerald-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Nilai</p>
          <h3 className="text-xl font-bold text-gray-900">
            Rp {(stats.totalRevenue / 1000000).toFixed(1)}jt
          </h3>
        </div>
      </div>

      {/* ============ SHIPMENTS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daftar Shipment</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {shipments.length} shipment
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari tracking, pengirim, penerima..."
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
                  <option value="price">Nilai Tertinggi</option>
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
            <p className="text-gray-500 font-medium">Memuat data shipments...</p>
          </div>
        ) : sortedShipments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search || status
                ? "Tidak ada shipment ditemukan"
                : "Belum ada shipment"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search || status
                ? "Coba ubah filter atau kata kunci pencarian Anda"
                : "Shipment akan muncul di sini ketika ada pengiriman baru"}
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
                    No. Resi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pengirim / Penerima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Berat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ongkir
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
                {sortedShipments.map((item) => {
                  const statusCfg = statusConfig[item.status] || statusConfig.pending;
                  const StatusIcon = statusCfg.icon;

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
                        <div className="space-y-1">
                          <div>
                            <p className="text-xs text-gray-500">Pengirim</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.sender_name}
                            </p>
                          </div>
                          <div className="pt-1 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Penerima</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.receiver_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs">
                          <div>
                            <p className="text-gray-500 mb-0.5">Dari</p>
                            <p className="font-semibold text-gray-900">
                              {item.origin_branch}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-red-500 px-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            <div className="w-4 h-px bg-red-300" />
                            <ChevronRight size={10} />
                          </div>
                          <div>
                            <p className="text-gray-500 mb-0.5">Ke</p>
                            <p className="font-semibold text-gray-900">
                              {item.destination_branch}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Weight size={14} className="text-gray-400" />
                          {item.total_weight} Kg
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {Number(item.total_price).toLocaleString("id-ID")}
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}