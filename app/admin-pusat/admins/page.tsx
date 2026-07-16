"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import {
  Users,
  Search,
  ArrowUpDown,
  ChevronRight,
  X,
  Mail,
  Building2,
  Plus,
  Edit3,
  Trash2,
  Hash,
  Shield,
  TrendingUp,
} from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
  branch: string;
  branch_id: number;
}

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "name_asc" | "name_desc">("newest");

  useEffect(() => {
    getAdmins();
  }, []);

  async function getAdmins() {
    setLoading(true);
    try {
      const res = await fetch("/api/admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Gagal mengambil data admin", err);
    } finally {
      setLoading(false);
    }
  }

  // Filter & Sort Logic
  const filteredAdmins = useMemo(() => {
    return admins
      .filter((admin) => {
        const matchSearch =
          search === "" ||
          admin.name.toLowerCase().includes(search.toLowerCase()) ||
          admin.email.toLowerCase().includes(search.toLowerCase()) ||
          admin.branch.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        return b.id - a.id; // newest
      });
  }, [admins, search, sortBy]);

  // Summary Stats
  const stats = useMemo(() => {
    const uniqueBranches = new Set(admins.map((a) => a.branch)).size;
    return {
      total: admins.length,
      branches: uniqueBranches,
    };
  }, [admins]);

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/manager/dashboard" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Admin Cabang</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Data Admin Cabang
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola akun administrator untuk setiap cabang ekspedisi
          </p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Tambah Admin</span>
        </button>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Shield className="text-red-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Admin</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Building2 className="text-blue-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              Aktif
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Cabang Terkelola</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.branches}</h3>
        </div>
      </div>

      {/* ============ ADMINS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daftar Administrator</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {filteredAdmins.length} dari {admins.length} admin
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau cabang..."
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
                  <option value="name_asc">Nama (A-Z)</option>
                  <option value="name_desc">Nama (Z-A)</option>
                </select>
                <ArrowUpDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Memuat data admin...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {search ? "Tidak ada admin ditemukan" : "Belum ada data admin"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              {search
                ? "Coba ubah kata kunci pencarian Anda"
                : "Admin cabang yang terdaftar akan muncul di sini"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 font-semibold text-gray-700 hover:text-red-600 transition-all"
              >
                Reset Pencarian
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
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cabang
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <Hash size={14} className="text-red-600" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {admin.name}
                          </p>
                          <p className="text-xs text-gray-500">ID: #{admin.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                        <span>{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Building2 size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{admin.branch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                        >
                          <Edit3 size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setOpenDelete(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 size={12} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ MODALS ============ */}
      <AddModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={getAdmins}
      />

      {selectedAdmin && (
        <>
          <DeleteModal
            open={openDelete}
            admin={selectedAdmin}
            onClose={() => {
              setOpenDelete(false);
              setSelectedAdmin(null);
            }}
            onSuccess={getAdmins}
          />
        </>
      )}
    </div>
  );
}