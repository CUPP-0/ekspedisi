'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDB } from "@/lib/indexeddb";
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  User,
  Search,
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Bell,
  Menu,
  X,
  ChevronRight,
  Star,
  Filter,
  Download,
  ArrowUpDown,
  Eye,
  TrendingUp,
  DollarSign,
  Weight,
  Calendar,
  ArrowLeft,
  LayoutGrid,
  List,
  SortAsc,
} from 'lucide-react';

interface Shipment {
  id: number;
  tracking_number: string;
  receiver_name: string;
  receiver_address?: string;
  origin_city: string;
  destination_city: string;
  total_weight: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function ShipmentPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price'>('newest');

  async function getData() {
    setLoading(true);

    try {
      // Jika offline
      if (!navigator.onLine) {
        const db = await getDB();
        const cache = await db.get('shipments', 'list');

        if (cache) {
          setShipments(cache);
        } else {
          setShipments([]);
        }

        return;
      }

      // Jika online
      const res = await fetch('/api/customers/shipments');
      const data = await res.json();

      const normalized = (Array.isArray(data) ? data : []).map((item: any) => ({
        ...item,
        total_weight: parseFloat(item.total_weight) || 0,
        total_price: parseFloat(item.total_price) || 0,
      }));

      setShipments(normalized);

      // Simpan cache terbaru
      const db = await getDB();
      await db.put('shipments', normalized, 'list');
    } catch (err) {
      console.error(err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // Status config
  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string; dot: string }> = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      icon: Clock,
      label: 'Pending',
      dot: 'bg-yellow-500',
    },
    picked_up: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      icon: Truck,
      label: 'Diproses',
      dot: 'bg-blue-500',
    },
    in_transit: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      icon: Truck,
      label: 'Dalam Pengiriman',
      dot: 'bg-purple-500',
    },
    arrived_at_branch: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      icon: Truck,
      label: 'Dalam Pengiriman',
      dot: 'bg-purple-500',
    },
    out_for_delivery: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      icon: Truck,
      label: 'Dalam Pengiriman',
      dot: 'bg-purple-500',
    },
    delivered: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: CheckCircle2,
      label: 'Selesai',
      dot: 'bg-green-500',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: AlertCircle,
      label: 'Dibatalkan',
      dot: 'bg-red-500',
    },
  };

  // Filter & search
  const filteredShipments = shipments
    .filter((item) => {
      const matchFilter = activeFilter === 'all' || item.status === activeFilter;
      const matchSearch =
        searchQuery === '' ||
        item.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.receiver_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination_city?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'price') return b.total_price - a.total_price;
      return 0;
    });

  // Stats
  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === 'pending').length,
    process: shipments.filter((s) => s.status === 'picked_up').length,
    shipping: shipments.filter((s) => s.status === 'out_for_delivery').length,
    completed: shipments.filter((s) => s.status === 'delivered').length,
    totalValue: shipments.reduce((sum, s) => sum + s.total_price, 0),
    totalWeight: shipments.reduce((sum, s) => sum + s.total_weight, 0),
  };

  // Menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard', active: false },
    { icon: Package, label: 'Shipments', href: '/customer/shipments', active: true },
    { icon: User, label: 'Profile', href: '/customer/profile', active: false },
  ];

  // Filter tabs
  const filterTabs = [
    { key: 'all', label: 'Semua', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'picked_up', label: 'Diproses', count: stats.process },
    { key: 'out_for_delivery', label: 'Dikirim', count: stats.shipping },
    { key: 'delivered', label: 'Selesai', count: stats.completed },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ============ SIDEBAR ============ */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-red-200">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 leading-tight">
                  BAZMA <span className="text-red-600">Express</span>
                </h1>
                <p className="text-[10px] text-gray-500 leading-tight">Customer Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    item.active ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{item.label}</span>
                  {item.active && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button onClick={() => router.push('/login/customer')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all">
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 max-w-md flex-1">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Cari nomor resi atau nama penerima..." className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder:text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              </button>

              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">Customer</p>
                  <p className="text-xs text-gray-500 leading-tight">Member</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 space-y-6">
          {/* Breadcrumb + Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/customer/dashboard" className="hover:text-red-600 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-semibold">Shipments</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Daftar Pengiriman</h1>
                  <p className="text-sm text-gray-500 mt-1">Kelola dan pantau semua pengiriman Anda</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Export logic here
                  console.log('Export shipments');
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={() => router.push('/customer/shipments/create')}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Buat Shipment</span>
              </button>
            </div>
          </div>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
                  <Package className="text-red-600" size={20} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Pengiriman</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-yellow-50 w-11 h-11 rounded-xl flex items-center justify-center">
                  <Clock className="text-yellow-600" size={20} />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">Aktif</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Dalam Proses</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pending + stats.process + stats.shipping}</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Nilai</p>
              <h3 className="text-2xl font-bold text-gray-900">Rp {(stats.totalValue / 1000000).toFixed(1)}jt</h3>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
                  <Weight className="text-blue-600" size={20} />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Kg</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Berat</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalWeight.toFixed(1)}</h3>
            </div>
          </div>

          {/* Shipments Table/Card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table Header with Filters */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Semua Pengiriman</h2>
                  <p className="text-sm text-gray-500">
                    Menampilkan {filteredShipments.length} dari {shipments.length} pengiriman
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 flex-1 lg:flex-none lg:w-64">
                    <Search size={16} className="text-gray-400" />
                    <input type="text" placeholder="Cari resi, penerima, kota..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-sm flex-1 min-w-0" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
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
                    <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1">
                    <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      <List size={16} />
                    </button>
                    <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
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
                      activeFilter === tab.key ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeFilter === tab.key ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}`}>{tab.count}</span>
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
            ) : filteredShipments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-gray-400" size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{searchQuery || activeFilter !== 'all' ? 'Tidak ada pengiriman ditemukan' : 'Belum ada shipment'}</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">{searchQuery || activeFilter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian Anda' : 'Mulai kirim paket pertama Anda dan pantau perjalanannya di sini'}</p>
                {searchQuery || activeFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilter('all');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 font-semibold text-gray-700 hover:text-red-600 transition-all"
                  >
                    Reset Filter
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/customer/shipments/create')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Plus size={18} />
                    Buat Shipment Pertama
                  </button>
                )}
              </div>
            ) : viewMode === 'table' ? (
              /* TABLE VIEW */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Resi</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Penerima</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rute</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Berat</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredShipments.map((item) => {
                      const status = statusConfig[item.status] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <Package size={16} className="text-red-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{item.tracking_number}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar size={10} />
                                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900 text-sm">{item.receiver_name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{item.receiver_address || item.destination_city}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-700">{item.origin_city}</span>
                              <div className="flex items-center gap-1 text-red-500">
                                <div className="w-1 h-1 bg-red-500 rounded-full" />
                                <div className="w-6 h-px bg-red-300" />
                                <ChevronRight size={12} />
                              </div>
                              <span className="font-medium text-gray-700">{item.destination_city}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-700">{item.total_weight} Kg</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-gray-900">Rp {Number(item.total_price).toLocaleString('id-ID')}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => router.push(`/customer/shipments/${item.id}`)}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye size={14} />
                              Detail
                            </button>
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
                {filteredShipments.map((item) => {
                  const status = statusConfig[item.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => router.push(`/customer/shipments/${item.id}`)}
                      className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-red-200 hover:shadow-lg rounded-xl p-5 cursor-pointer transition-all group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                            <Package size={18} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.tracking_number}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${status.bg} ${status.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>

                      {/* Receiver */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Penerima</p>
                        <p className="font-semibold text-gray-900 text-sm">{item.receiver_name}</p>
                      </div>

                      {/* Route */}
                      <div className="bg-white rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <p className="text-gray-500 mb-0.5">Dari</p>
                            <p className="font-semibold text-gray-900">{item.origin_city}</p>
                          </div>
                          <div className="flex items-center gap-1 text-red-500 px-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            <div className="w-8 h-px bg-red-300" />
                            <ChevronRight size={12} />
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 mb-0.5">Ke</p>
                            <p className="font-semibold text-gray-900">{item.destination_city}</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="font-bold text-gray-900">Rp {Number(item.total_price).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Berat</p>
                          <p className="font-bold text-gray-900">{item.total_weight} Kg</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
