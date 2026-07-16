'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { generateReceiptPDF } from '@/lib/generate-receipt';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  User,
  Search,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Bell,
  Menu,
  X,
  MapPin,
  Phone,
  Calendar,
  Weight,
  DollarSign,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  CreditCard,
  Hash,
  FileText,
  Home,
  Building2,
  PackagePlus,
  Download,
  Eye,
  Camera,
  ZoomIn,
  Maximize2,
  ImageOff,
} from 'lucide-react';

// Helper function untuk build path foto
function getPhotoUrl(photo: string | null | undefined): string | null {
  if (!photo) return null;
  // Kalau sudah full URL (http/https), return langsung
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  // Kalau cuma nama file, prefix dengan /uploads/proofs/
  return `/uploads/proofs/${photo}`;
}

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    setLoading(true);

    try {
      const res = await fetch(`/api/customers/shipments/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        router.push('/customer/shipments');
        return;
      }

      setShipment(data.shipment);
      setItems(data.items);
      setPayment(data.payment);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard', active: false },
    { icon: Package, label: 'Shipments', href: '/customer/shipments', active: true },
    { icon: User, label: 'Profile', href: '/customer/profile', active: false },
  ];

  // Status config
  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string; step: number }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Menunggu Pembayaran', step: 0 },
    unpaid: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Belum Dibayar', step: 0 },
    assigned: { bg: 'bg-blue-100', text: 'text-blue-700', icon: User, label: 'Kurir Ditugaskan', step: 1 },
    picked_up: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Package, label: 'Paket Diambil', step: 2 },
    in_transit: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck, label: 'Dalam Perjalanan', step: 3 },
    arrived_at_branch: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Building2, label: 'Tiba di Cabang', step: 4 },
    out_for_delivery: { bg: 'bg-pink-100', text: 'text-pink-700', icon: MapPin, label: 'Dalam Pengantaran', step: 5 },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2, label: 'Terkirim', step: 6 },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Dibatalkan', step: 0 },
  };

  const status = statusConfig[shipment?.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  // Tracking steps
  const trackingSteps = [
    {
      icon: User,
      label: 'Kurir Ditugaskan',
      desc: 'Kurir telah ditugaskan untuk mengambil paket',
      status: 'assigned',
      completed: status.step >= 1,
      current: status.step === 1,
      timestamp: status.step >= 1 ? shipment?.updated_at : null,
    },
    {
      icon: Package,
      label: 'Paket Diambil',
      desc: 'Kurir telah mengambil paket dari pengirim',
      status: 'picked_up',
      completed: status.step >= 2,
      current: status.step === 2,
      timestamp: status.step >= 2 ? shipment?.updated_at : null,
    },
    {
      icon: Truck,
      label: 'Dalam Perjalanan',
      desc: 'Paket dalam perjalanan ke cabang tujuan',
      status: 'in_transit',
      completed: status.step >= 3,
      current: status.step === 3,
      timestamp: status.step >= 3 ? shipment?.updated_at : null,
    },
    {
      icon: Building2,
      label: 'Tiba di Cabang',
      desc: 'Paket tiba di cabang tujuan',
      status: 'arrived_at_branch',
      completed: status.step >= 4,
      current: status.step === 4,
      timestamp: status.step >= 4 ? shipment?.updated_at : null,
    },
    {
      icon: MapPin,
      label: 'Dalam Pengantaran',
      desc: 'Kurir mengantar paket ke alamat penerima',
      status: 'out_for_delivery',
      completed: status.step >= 5,
      current: status.step === 5,
      timestamp: status.step >= 5 ? shipment?.updated_at : null,
    },
    {
      icon: CheckCircle2,
      label: 'Terkirim',
      desc: 'Paket berhasil diterima oleh penerima',
      status: 'delivered',
      completed: status.step >= 6,
      current: status.step === 6,
      timestamp: status.step >= 6 ? shipment?.updated_at : null,
    },
  ];

  async function handleDownloadReceipt() {
    setDownloading(true);
    try {
      await generateReceiptPDF(shipment, items);
    } catch (error) {
      console.error(error);
      alert('Gagal mengunduh resi. Silakan coba lagi.');
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat detail shipment...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Shipment Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Shipment yang Anda cari tidak tersedia atau telah dihapus.</p>
          <button onClick={() => router.push('/customer/shipments')} className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Kembali ke Shipments
          </button>
        </div>
      </div>
    );
  }

  const isPaid = payment?.payment_status === 'paid';
  const isPending = payment?.payment_status === 'pending';
  const isDelivered = shipment.status === 'delivered';
  const photoUrl = getPhotoUrl(shipment.photo);
  const hasPhoto = !!photoUrl;

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
            <button onClick={() => router.push('/logout')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all">
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
        <main className="p-6 max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/customer/dashboard" className="hover:text-red-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} />
            <Link href="/customer/shipments" className="hover:text-red-600 transition-colors">
              Shipments
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-semibold">Detail</span>
          </div>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Detail Shipment</h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}>
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Hash size={14} />
                  <span className="font-semibold text-gray-700">{shipment.tracking_number}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadReceipt}
                disabled={downloading}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <span>Mengunduh...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Resi</span>
                  </>
                )}
              </button>
              <button
                onClick={() => router.push(`/tracking/${shipment.tracking_number}`)}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 flex items-center gap-2"
              >
                <Eye size={18} />
                <span>Lacak Paket</span>
              </button>
            </div>
          </div>

          {/* ============ TRACKING PROGRESS ============ */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                  <Truck className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Progress Pengiriman</h2>
                  <p className="text-sm text-gray-500">Status terkini paket Anda</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${(status.step / 6) * 100}%` }} />
                </div>

                {/* Steps */}
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index < status.step;
                  const isCurrent = index === status.step - 1;

                  return (
                    <div key={index} className="relative flex flex-col items-center z-10 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-red-100' : ''}`}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="mt-3 text-center">
                        <p className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============ INFO CARDS ============ */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Shipment Info */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Informasi Shipment</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Clock className="text-blue-600" size={18} />
                    </div>
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <span className="font-semibold text-gray-900 capitalize">{shipment.status.replaceAll('_', ' ')}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <Weight className="text-green-600" size={18} />
                    </div>
                    <span className="text-sm text-gray-600">Total Berat</span>
                  </div>
                  <span className="font-semibold text-gray-900">{shipment.total_weight} Kg</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-lg">
                      <DollarSign className="text-red-600" size={18} />
                    </div>
                    <span className="text-sm text-gray-600">Total Ongkir</span>
                  </div>
                  <span className="font-bold text-red-600 text-lg">Rp {Number(shipment.total_price).toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <Calendar className="text-purple-600" size={18} />
                    </div>
                    <span className="text-sm text-gray-600">Tanggal</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(shipment.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Branch Info */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                    <Building2 className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Rute Pengiriman</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="relative">
                  {/* Origin */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                        <MapPin size={20} />
                      </div>
                      <div className="w-0.5 h-12 bg-gradient-to-b from-red-300 to-orange-300 mt-2" />
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-xs text-gray-500 mb-1">Cabang Asal</p>
                      <p className="font-bold text-gray-900 text-lg">{shipment.origin_branch}</p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                        <Home size={20} />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-xs text-gray-500 mb-1">Cabang Tujuan</p>
                      <p className="font-bold text-gray-900 text-lg">{shipment.destination_branch}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ SENDER & RECEIVER ============ */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Sender */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                    <User className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Pengirim</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                    <User className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nama</p>
                    <p className="font-semibold text-gray-900">{shipment.sender_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                    <Phone className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Telepon</p>
                    <p className="font-semibold text-gray-900">{shipment.sender_phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                    <MapPin className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Alamat</p>
                    <p className="font-semibold text-gray-900">{shipment.sender_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                    <User className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Penerima</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                    <User className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nama</p>
                    <p className="font-semibold text-gray-900">{shipment.receiver_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                    <Phone className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Telepon</p>
                    <p className="font-semibold text-gray-900">{shipment.receiver_phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                    <MapPin className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Alamat</p>
                    <p className="font-semibold text-gray-900">{shipment.receiver_address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ ITEMS TABLE ============ */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-2 rounded-lg">
                  <PackagePlus className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Barang</h2>
                  <p className="text-sm text-gray-500">{items.length} item dalam pengiriman</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Barang</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Berat</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Berat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 w-9 h-9 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-indigo-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{item.item_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">{item.quantity} pcs</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700">{item.weight} Kg</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">{(item.quantity * item.weight).toFixed(2)} Kg</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============ BUKTI PENGIRIMAN (DELIVERY PROOF) ============ */}
          {isDelivered && hasPhoto && !photoError && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                      <Camera className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Bukti Pengiriman</h2>
                      <p className="text-sm text-gray-500">Foto bukti paket telah diterima</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                    <CheckCircle2 size={14} />
                    <span>Terverifikasi</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Photo Preview */}
                  <div className="md:col-span-2">
                    <div onClick={() => setLightboxOpen(true)} className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all">
                      <img src={photoUrl!} alt="Bukti Pengiriman" className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setPhotoError(true)} />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 text-white">
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                            <Maximize2 size={24} />
                          </div>
                          <span className="text-sm font-semibold">Klik untuk memperbesar</span>
                        </div>
                      </div>
                      {/* Badge */}
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <CheckCircle2 size={12} />
                        <span>Foto Bukti</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <h3 className="font-bold text-green-900">Pengiriman Selesai</h3>
                      </div>
                      <p className="text-sm text-green-800 leading-relaxed">Paket telah berhasil diterima oleh penerima. Foto di samping adalah bukti pengiriman yang diunggah oleh kurir.</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tanggal Diterima</p>
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {shipment.updated_at
                            ? new Date(shipment.updated_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : '-'}
                        </p>
                      </div>

                      {shipment.courier_name && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Kurir Pengantar</p>
                          <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                            <User size={14} className="text-gray-400" />
                            {shipment.courier_name}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Penerima</p>
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                          <User size={14} className="text-gray-400" />
                          {shipment.receiver_name}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-green-200 flex items-center justify-center gap-2"
                    >
                      <ZoomIn size={16} />
                      <span>Lihat Foto Lengkap</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ PHOTO ERROR STATE ============ */}
          {isDelivered && hasPhoto && photoError && (
            <div className="bg-white rounded-2xl border border-yellow-200 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg">
                    <ImageOff className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Foto Tidak Dapat Dimuat</h2>
                    <p className="text-sm text-gray-500">Bukti pengiriman tidak dapat ditampilkan</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">File Foto Tidak Ditemukan</p>
                    <p className="text-sm text-yellow-800">Foto bukti pengiriman tidak dapat dimuat. Silakan hubungi customer service jika Anda membutuhkan bukti pengiriman.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ DELIVERED WITHOUT PHOTO ============ */}
          {isDelivered && !hasPhoto && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              <div className="relative flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Paket Telah Diterima</h3>
                  <p className="text-white/90 text-sm">Paket Anda telah berhasil sampai ke tujuan. Terima kasih telah menggunakan layanan kami.</p>
                </div>
              </div>
            </div>
          )}

          {/* ============ PAYMENT CTA ============ */}
          {(!payment || payment.payment_status !== 'paid') && (
            <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <CreditCard size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{isPending ? 'Lanjutkan Pembayaran' : 'Selesaikan Pembayaran'}</h3>
                    <p className="text-white/90 text-sm">
                      Total: <span className="font-bold text-yellow-300 text-lg">Rp {Number(shipment.total_price).toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                </div>

                <button onClick={() => router.push(`/customer/payment/${shipment.id}`)} className="bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-xl whitespace-nowrap">
                  Bayar Sekarang
                </button>
              </div>
            </div>
          )}

          {/* Paid Badge */}
          {isPaid && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              <div className="relative flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Pembayaran Berhasil</h3>
                  <p className="text-white/90 text-sm">Paket Anda akan segera diproses dan dikirim</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============ LIGHTBOX MODAL ============ */}
      {lightboxOpen && hasPhoto && !photoError && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setLightboxOpen(false)}>
          {/* Close Button */}
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10" aria-label="Close">
            <X size={24} />
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={photoUrl!}
              alt="Bukti Pengiriman - Full View"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onError={() => {
                setPhotoError(true);
                setLightboxOpen(false);
              }}
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-bold text-lg flex items-center gap-2">
                    <Camera size={20} />
                    Bukti Pengiriman
                  </p>
                  <p className="text-sm text-white/80">
                    {shipment.tracking_number} • {shipment.receiver_name}
                  </p>
                </div>
                <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Terverifikasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
