'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  User,
  Search,
  LogOut,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Bell,
  Menu,
  X,
  ArrowUpRight,
  Calendar,
  Filter,
  ChevronRight,
  Star,
} from 'lucide-react';

export default function DashboardCustomer() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    getDashboard();
  }, []);

  async function getDashboard() {
    try {
      const res = await fetch('/api/customers/dashboard');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter shipments based on active filter & search
  const filteredShipments = data?.history?.filter((item: any) => {
    const matchFilter =
      activeFilter === 'all' || item.status === activeFilter;
    const matchSearch =
      searchQuery === '' ||
      item.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receiver_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  }) || [];

  // Status badge config
  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
    process: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Truck, label: 'Diproses' },
    shipping: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck, label: 'Dalam Pengiriman' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Selesai' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Dibatalkan' },
  };

  // Sidebar menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard', active: true },
    { icon: Package, label: 'Shipments', href: '/customer/shipments', active: false },
    { icon: User, label: 'Profile', href: '/customer/profile', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 mb-6">Terjadi kesalahan saat memuat dashboard. Silakan coba lagi.</p>
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

  const userName = data.user?.name || 'Customer';
  const userInitial = userName.charAt(0).toUpperCase();

  // Stats cards data
  const stats = [
    {
      label: 'Total Pengiriman',
      value: data.total || 0,
      icon: Package,
      color: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Pending',
      value: data.pending || 0,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      trend: '+3',
      trendUp: true,
    },
    {
      label: 'Diproses',
      value: data.process || 0,
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '-2',
      trendUp: false,
    },
    {
      label: 'Selesai',
      value: data.completed || 0,
      icon: CheckCircle2,
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+8%',
      trendUp: true,
    },
  ];

  // Quick actions
  const quickActions = [
    { icon: Plus, label: 'Kirim Paket Baru', href: '/customer/shipments/create', color: 'bg-red-600' },
    { icon: Search, label: 'Lacak Paket', href: '/tracking', color: 'bg-orange-500' },
    { icon: MapPin, label: 'Cek Ongkir', href: '/cek-ongkir', color: 'bg-yellow-500' },
    { icon: Star, label: 'Riwayat', href: '/customer/shipments', color: 'bg-blue-600' },
  ];

  // Mock monthly data for chart (fallback if not available)
  const monthlyData = data.monthlyStats || [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 19 },
    { month: 'Mar', value: 15 },
    { month: 'Apr', value: 25 },
    { month: 'Mei', value: 22 },
    { month: 'Jun', value: 30 },
  ];
  const maxMonthly = Math.max(...monthlyData.map((d: any) => d.value));

  // Filter tabs
  const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Pending' },
    { key: 'process', label: 'Diproses' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
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

          {/* User Profile Card */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{data.user?.email || 'customer@bazma.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-700">Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Menu Utama
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    item.active
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
            <button
              onClick={() => router.push('/login/customer')}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 max-w-md flex-1">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nomor resi atau nama penerima..."
                  className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              </button>

              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {userInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{userName}</p>
                  <p className="text-xs text-gray-500 leading-tight">Customer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-800 rounded-full opacity-30 blur-2xl" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  <Calendar size={12} />
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                  Halo, {userName}! 👋
                </h1>
                <p className="text-white/90 text-sm lg:text-base max-w-lg">
                  Selamat datang kembali. Pantau semua pengiriman kamu dan kelola paket dengan mudah.
                </p>
              </div>

              <button
                onClick={() => router.push('/customer/shipments/create')}
                className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-xl whitespace-nowrap"
              >
                <Plus size={20} />
                <span>Kirim Paket Baru</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                        stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{stat.trend}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {Number(stat.value).toLocaleString('id-ID')}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Quick Actions + Chart Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Aksi Cepat</h2>
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
                      <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
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

          {/* Recent Shipments Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Pengiriman Terbaru</h2>
                  <p className="text-sm text-gray-500">
                    {filteredShipments.length} dari {data.history?.length || 0} pengiriman
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none text-sm flex-1 min-w-0"
                    />
                  </div>

                  <button
                    onClick={() => router.push('/customer/shipments/create')}
                    className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-red-200 transition-all"
                  >
                    <Plus size={16} />
                    <span>Buat Shipment</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto">
                <Filter size={16} className="text-gray-400 flex-shrink-0" />
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      activeFilter === tab.key
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
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
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Package className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">Tidak ada pengiriman ditemukan</p>
                        <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                      </td>
                    </tr>
                  ) : (
                    filteredShipments.slice(0, 5).map((item: any) => {
                      const status = statusConfig[item.status] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      return (
                        <tr key={item.tracking_number} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
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
                            <p className="font-medium text-gray-900 text-sm">
                              {item.receiver_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {item.receiver_address || '-'}
                            </p>
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
                            <p className="text-sm text-gray-700">
                              {new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.created_at).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => router.push(`/tracking/${item.tracking_number}`)}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
                            >
                              Detail
                              <ArrowUpRight size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {data.history?.length > 5 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <Link
                  href="/customer/shipments"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Lihat Semua Pengiriman
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}