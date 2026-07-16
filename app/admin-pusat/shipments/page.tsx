"use client";

import { useEffect, useMemo, useState } from "react";
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
  Weight,
  DollarSign,
  TrendingUp,
  Hash,
  Plus,
  Download,
  List,
  LayoutGrid,
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
  payment_status: string;
  status: string;
  created_at: string;
}

export default function ManagerShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price">("newest");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin-pusat/shipments");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipments(data);
    } catch (err) {
      console.log(err);
      alert("Gagal mengambil data shipment.");
    } finally {
      setLoading(false);
    }
  }

  // Filter & search
  const filtered = useMemo(() => {
    return shipments
      .filter((item) => {
        const matchSearch =
          search === "" ||
          item.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
          item.sender_name.toLowerCase().includes(search.toLowerCase()) ||
          item.receiver_name.toLowerCase().includes(search.toLowerCase()) ||
          item.origin_branch.toLowerCase().includes(search.toLowerCase()) ||
          item.destination_branch.toLowerCase().includes(search.toLowerCase());
        const matchFilter = activeFilter === "all" || item.status === activeFilter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "oldest")
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === "price") return b.total_price - a.total_price;
        return 0;
      });
  }, [shipments, search, activeFilter, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: shipments.length,
      paid: shipments.filter((s) => s.payment_status === "paid").length,
      pending: shipments.filter((s) => s.payment_status !== "paid" && s.payment_status !== "failed").length,
      delivered: shipments.filter((s) => s.status === "delivered").length,
      inTransit: shipments.filter((s) => s.status === "in_transit" || s.status === "out_for_delivery").length,
      totalRevenue: shipments
        .filter((s) => s.payment_status === "paid")
        .reduce((sum, s) => sum + Number(s.total_price), 0),
    };
  }, [shipments]);

  // Status config
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

  // Payment status config
  const paymentConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
  };

  // Filter tabs
  const filterTabs = [
    { key: "all", label: "Semua", count: stats.total },
    { key: "pending", label: "Pending", count: shipments.filter((s) => s.status === "pending").length },
    { key: "assigned", label: "Ditugaskan", count: shipments.filter((s) => s.status === "assigned").length },
    { key: "in_transit", label: "Perjalanan", count: shipments.filter((s) => s.status === "in_transit").length },
    { key: "delivered", label: "Terkirim", count: shipments.filter((s) => s.status === "delivered").length },
  ];

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin-pusat/dashboard" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Shipments</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Daftar Shipment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola dan pantau semua pengiriman di seluruh cabang
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 flex items-center gap-2">
            <Plus size={18} />
            <span>Buat Shipment</span>
          </button>
        </div>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
          <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
          <h3 className="text-2xl font-bold text-gray-900">
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
              <h2 className="text-lg font-bold text-gray-900">Semua Shipment</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {filtered.length} dari {shipments.length} shipment
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari resi, pengirim, penerima..."
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
                  <option value="price">Harga Tertinggi</option>
                </select>
                <ArrowUpDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-white shadow text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "card"
                      ? "bg-white shadow text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
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
            <p className="text-gray-500 font-medium">Memuat data shipments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search || activeFilter !== "all"
                ? "Tidak ada shipment ditemukan"
                : "Belum ada shipment"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search || activeFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian Anda"
                : "Mulai buat shipment pertama untuk cabang Anda"}
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
            ) : (
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">
                <Plus size={18} />
                Buat Shipment Pertama
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
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
                    Pembayaran
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
                {filtered.map((item) => {
                  const status = statusConfig[item.status] || statusConfig.pending;
                  const payment = paymentConfig[item.payment_status] || paymentConfig.pending;
                  const StatusIcon = status.icon;
                  const PaymentIcon = payment.icon;

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
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={10} />
                              {new Date(item.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
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
                        <span className="text-sm font-medium text-gray-700">
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
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${payment.bg} ${payment.text}`}
                        >
                          <PaymentIcon size={12} />
                          {payment.label}
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
        ) : (
          /* CARD VIEW */
          <div className="p-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const status = statusConfig[item.status] || statusConfig.pending;
              const payment = paymentConfig[item.payment_status] || paymentConfig.pending;
              const StatusIcon = status.icon;
              const PaymentIcon = payment.icon;

              return (
                <Link
                  key={item.id}
                  href={`/manager/shipments/${item.id}`}
                  className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-red-200 hover:shadow-lg rounded-xl p-5 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                        <Package size={18} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {item.tracking_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  {/* Sender & Receiver */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-16">Pengirim:</span>
                      <span className="font-semibold text-gray-900 truncate">
                        {item.sender_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-16">Penerima:</span>
                      <span className="font-semibold text-gray-900 truncate">
                        {item.receiver_name}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="bg-white rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-gray-500 mb-0.5">Dari</p>
                        <p className="font-semibold text-gray-900">
                          {item.origin_branch}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-red-500 px-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        <div className="w-6 h-px bg-red-300" />
                        <ChevronRight size={12} />
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 mb-0.5">Ke</p>
                        <p className="font-semibold text-gray-900">
                          {item.destination_branch}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Ongkir</p>
                      <p className="font-bold text-gray-900">
                        Rp {Number(item.total_price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${payment.bg} ${payment.text}`}
                      >
                        <PaymentIcon size={10} />
                        {payment.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}