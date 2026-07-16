'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AddCourierModal from './AddCourierModal';
import { Users, Search, Filter, ArrowUpDown, Mail, Phone, Building2, Calendar, ChevronRight, X, Eye, TrendingUp, Clock, CheckCircle2, AlertCircle, UserPlus, UserCheck, UserX } from 'lucide-react';

interface CourierApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  branch_name: string;
}

export default function CourierApplicationPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<CourierApplication[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [openAdd, setOpenAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);

    try {
      const res = await fetch('/api/admin/couriers');
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setApplications(data);
    } catch (err) {
      console.log(err);
      alert('Gagal mengambil data kurir.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  // Filter & search
  const filtered = useMemo(() => {
    return applications
      .filter((item) => {
        const matchSearch =
          search === '' || item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.phone.includes(search) || item.branch_name.toLowerCase().includes(search.toLowerCase());
        const matchFilter = activeFilter === 'all' || item.status === activeFilter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return 0;
      });
  }, [applications, search, activeFilter, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
      approved: applications.filter((a) => a.status === 'approved').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    };
  }, [applications]);

  // Status config
  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string; dot: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending', dot: 'bg-yellow-500' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Disetujui', dot: 'bg-green-500' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Ditolak', dot: 'bg-red-500' },
  };

  // Filter tabs
  const filterTabs = [
    { key: 'all', label: 'Semua', count: stats.total },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat data lamaran...</p>
        </div>
      </div>
    );
  }

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
          <span className="text-gray-900 font-semibold">Lamaran Kurir</span>
        </div>

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Lamaran Kurir</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar calon kurir yang mendaftar di cabang Anda</p>
        </div>
      </div>

      {/* ============ APPLICATIONS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Semua Lamaran</h2>
              <p className="text-sm text-gray-500">
                Menampilkan {filtered.length} dari {applications.length} lamaran
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder="Cari nama, email, cabang..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none text-sm flex-1 min-w-0" />
                {search && (
                  <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
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
                <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                  activeFilter === tab.key ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeFilter === tab.key ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>{tab.count}</span>
              </button>
            ))}
            <button onClick={() => setOpenAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              + Tambah Kurir
            </button>
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{search || activeFilter !== 'all' ? 'Tidak ada lamaran ditemukan' : 'Belum ada lamaran'}</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{search || activeFilter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian Anda' : 'Lamaran kurir akan muncul di sini saat ada yang mendaftar'}</p>
            {search || activeFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveFilter('all');
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelamar</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontak</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cabang</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const status = statusConfig[item.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{item.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Pelamar</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{item.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{item.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{item.branch_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/courier-applications/${item.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity">
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
      <AddCourierModal open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={loadApplications} />
    </div>
  );
}
