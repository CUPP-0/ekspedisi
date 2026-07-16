"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import {
  BadgeDollarSign,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Home,
  Clock,
  TrendingUp,
  DollarSign,
  Route,
  ChevronRight,
  X,
  Package,
  Calendar,
  Hash,
} from "lucide-react";

interface Rate {
  id: number;
  origin_city: string;
  destination_city: string;
  price_per_kg: number;
  estimated_days: number;
}

export default function RatePage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<Rate | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "days">("newest");

  async function getRates() {
    setLoading(true);

    try {
      const res = await fetch("/api/rates");
      const data = await res.json();

      setRates(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRates();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Hapus tarif ini?")) return;

    const res = await fetch(`/api/rates/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    alert(data.message);

    getRates();
  }

  // Filter & search
  const filtered = useMemo(() => {
    return rates
      .filter((rate) => {
        const matchSearch =
          search === "" ||
          rate.origin_city.toLowerCase().includes(search.toLowerCase()) ||
          rate.destination_city.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price_per_kg - b.price_per_kg;
        if (sortBy === "price_desc") return b.price_per_kg - a.price_per_kg;
        if (sortBy === "days") return a.estimated_days - b.estimated_days;
        return b.id - a.id; // newest
      });
  }, [rates, search, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    if (rates.length === 0) {
      return {
        total: 0,
        avgPrice: 0,
        avgDays: 0,
        cheapest: 0,
        mostExpensive: 0,
      };
    }

    const prices = rates.map((r) => r.price_per_kg);
    const days = rates.map((r) => r.estimated_days);

    return {
      total: rates.length,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      avgDays: Math.round(days.reduce((a, b) => a + b, 0) / days.length),
      cheapest: Math.min(...prices),
      mostExpensive: Math.max(...prices),
    };
  }, [rates]);

  // Filter tabs
  const filterTabs = [
    { key: "all", label: "Semua Rute", count: rates.length },
    { key: "fast", label: "Cepat (≤3 hari)", count: rates.filter((r) => r.estimated_days <= 3).length },
    { key: "normal", label: "Normal (4-7 hari)", count: rates.filter((r) => r.estimated_days > 3 && r.estimated_days <= 7).length },
    { key: "slow", label: "Lambat (>7 hari)", count: rates.filter((r) => r.estimated_days > 7).length },
  ];

  const [activeFilter, setActiveFilter] = useState("all");

  // Apply filter tabs
  const finalFiltered = useMemo(() => {
    return filtered.filter((rate) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "fast") return rate.estimated_days <= 3;
      if (activeFilter === "normal") return rate.estimated_days > 3 && rate.estimated_days <= 7;
      if (activeFilter === "slow") return rate.estimated_days > 7;
      return true;
    });
  }, [filtered, activeFilter]);

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/manager/dashboard" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Tarif</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Data Tarif Pengiriman
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola tarif pengiriman antar kota untuk seluruh cabang
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Tambah Tarif</span>
        </button>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Route className="text-red-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Rute</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              Rata-rata
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Harga per Kg</p>
          <h3 className="text-xl font-bold text-gray-900">
            Rp {stats.avgPrice.toLocaleString("id-ID")}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Clock className="text-purple-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
              Hari
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Estimasi Rata-rata</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.avgDays}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <BadgeDollarSign className="text-orange-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              Range
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Rentang Harga</p>
          <h3 className="text-sm font-bold text-gray-900">
            Rp {stats.cheapest.toLocaleString("id-ID")} - Rp {stats.mostExpensive.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>

      {/* ============ RATES TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daftar Tarif</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {finalFiltered.length} dari {rates.length} tarif
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kota asal/tujuan..."
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
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                  <option value="days">Estimasi Tercepat</option>
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
            <p className="text-gray-500 font-medium">Memuat data tarif...</p>
          </div>
        ) : finalFiltered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Route className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search || activeFilter !== "all"
                ? "Tidak ada tarif ditemukan"
                : "Belum ada tarif"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search || activeFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian Anda"
                : "Mulai tambahkan tarif pengiriman pertama untuk cabang Anda"}
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
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Tambah Tarif Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rute Pengiriman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Harga per Kg
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estimasi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {finalFiltered.map((rate, index) => {
                  // Determine speed category
                  const isFast = rate.estimated_days <= 3;
                  const isNormal = rate.estimated_days > 3 && rate.estimated_days <= 7;

                  return (
                    <tr key={rate.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <Hash size={14} className="text-red-600" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <MapPin size={12} className="text-red-500" />
                                <p className="text-xs text-gray-500">Dari</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {rate.origin_city}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-red-500 px-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full" />
                              <div className="w-6 h-px bg-red-300" />
                              <ChevronRight size={12} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Home size={12} className="text-orange-500" />
                                <p className="text-xs text-gray-500">Ke</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {rate.destination_city}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600">
                          Rp {Number(rate.price_per_kg).toLocaleString("id-ID")}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">per kilogram</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            isFast
                              ? "bg-green-100 text-green-700"
                              : isNormal
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          <Clock size={12} />
                          {rate.estimated_days} Hari
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelected(rate);
                              setShowEdit(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                          >
                            <Edit3 size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rate.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={12} />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        refresh={getRates}
      />

      {selected && (
        <EditModal
          open={showEdit}
          rate={selected}
          onClose={() => {
            setShowEdit(false);
            setSelected(null);
          }}
          refresh={getRates}
        />
      )}
    </div>
  );
}