'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  User,
  Search,
  LogOut,
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  ArrowLeft,
  ChevronRight,
  Bell,
  Menu,
  X,
  Truck,
  Calendar,
  Shield,
  AlertCircle,
  Hash,
  FileText,
} from 'lucide-react';

declare global {
  interface Window {
    snap: any;
  }
}

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<any>(null);
  const [token, setToken] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    loadShipment();
    loadSnap();
  }, []);

  async function loadShipment() {
    const res = await fetch(`/api/customers/shipments/${id}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      router.push('/customer/shipments');
      return;
    }

    setShipment(data.shipment);

    // API create akan mengembalikan token lama jika masih pending,
    // atau error jika sudah paid.
    await createPayment();
  }

  async function createPayment() {
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shipment_id: id,
      }),
    });

    const data = await res.json();

    // Kalau sudah dibayar
    if (res.status === 400) {
      setLoading(false);
      return;
    }

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setToken(data.token);
    setLoading(false);
  }

  function loadSnap() {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }

  function payNow() {
    if (!token) return;

    window.snap.pay(token, {
      onSuccess: async (result: any) => {
        await fetch('/api/payments/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shipment_id: id,
            order_id: result.order_id,
            transaction_id: result.transaction_id,
            transaction_status: result.transaction_status,
            payment_type: result.payment_type,
            fraud_status: result.fraud_status,
          }),
        });

        alert('Pembayaran berhasil');
        router.replace(`/customer/shipments/${id}`);
      },

      onPending: async (result: any) => {
        await fetch('/api/payments/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
        });

        router.push(`/customer/shipments/${id}`);
      },

      onError(result: any) {
        console.log(result);
        alert('Pembayaran gagal');
      },

      onClose() {
        router.push(`/customer/shipments/${id}`);
      },
    });
  }

  // Menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard', active: false },
    { icon: Package, label: 'Shipments', href: '/customer/shipments', active: true },
    { icon: User, label: 'Profile', href: '/customer/profile', active: false },
    { icon: MapPin, label: 'Alamat', href: '/customer/addresses', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Shipment yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => router.push('/customer/shipments')}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Shipments
          </button>
        </div>
      </div>
    );
  }

  const isPaid = !token;

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

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
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

            <div className="pt-4 mt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Lainnya
              </p>
              <Link
                href="/tracking"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <Search size={20} />
                <span className="text-sm">Lacak Paket</span>
              </Link>
              <Link
                href="/cek-ongkir"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <MapPin size={20} />
                <span className="text-sm">Cek Ongkir</span>
              </Link>
            </div>
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
                  C
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">Customer</p>
                  <p className="text-xs text-gray-500 leading-tight">Member</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 max-w-4xl mx-auto">
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
            <span className="text-gray-900 font-semibold">Pembayaran</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Pembayaran Shipment
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Selesaikan pembayaran untuk memproses pengiriman Anda
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* ============ SHIPMENT INFO ============ */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                    <Package className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Informasi Pengiriman</h2>
                    <p className="text-sm text-gray-500">Detail shipment Anda</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Tracking Number */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5 rounded-lg">
                      <Hash className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Nomor Resi</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {shipment.tracking_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-lg">
                      <Clock className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Status</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {shipment.status}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Menunggu Pembayaran
                  </span>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2.5 rounded-lg">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total Ongkir</p>
                      <p className="font-bold text-gray-900 text-2xl">
                        Rp {Number(shipment.total_price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ PAYMENT SECTION ============ */}
            {isPaid ? (
              /* SUCCESS STATE */
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-4 border-b border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-green-900">Pembayaran Berhasil</h2>
                      <p className="text-sm text-green-700">Shipment Anda akan segera diproses</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 text-center">
                  <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle2 className="text-green-500" size={56} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Pembayaran Anda telah berhasil diproses. Paket Anda akan segera diambil oleh kurir kami.
                  </p>

                  <div className="bg-white rounded-xl p-4 mb-6 inline-block">
                    <div className="flex items-center gap-3">
                      <Shield className="text-green-600" size={24} />
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Status Pembayaran</p>
                        <p className="font-bold text-green-600">Lunas & Terverifikasi</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => router.push(`/customer/shipments/${id}`)}
                      className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Package size={18} />
                      <span>Lihat Detail Shipment</span>
                    </button>
                    <button
                      onClick={() => router.push('/customer/shipments')}
                      className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      Kembali ke Shipments
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* PAYMENT ACTION */
              <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard size={24} className="text-yellow-300" />
                    <h2 className="text-xl font-bold">Metode Pembayaran</h2>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <DollarSign size={28} />
                        </div>
                        <div>
                          <p className="text-sm text-white/80 mb-1">Total Pembayaran</p>
                          <p className="text-3xl font-extrabold text-yellow-300">
                            Rp {Number(shipment.total_price).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-white/70 text-xs mb-1">Transfer Bank</p>
                        <p className="font-semibold">BCA, BNI, BRI, Mandiri</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-white/70 text-xs mb-1">E-Wallet</p>
                        <p className="font-semibold">GoPay, OVO, DANA</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={payNow}
                    className="w-full bg-white text-red-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-xl flex items-center justify-center gap-2 text-lg"
                  >
                    <CreditCard size={22} />
                    <span>Bayar Sekarang</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/80">
                    <Shield size={16} />
                    <span>Pembayaran aman & terenkripsi oleh Midtrans</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============ SECURITY INFO ============ */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl flex-shrink-0">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Pembayaran Aman & Terpercaya</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Transaksi diproses melalui payment gateway Midtrans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Data pembayaran Anda terenkripsi dengan SSL 256-bit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Support 24/7 untuk bantuan pembayaran</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}