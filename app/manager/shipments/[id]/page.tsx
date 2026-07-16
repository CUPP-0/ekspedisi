"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  User,
  MapPin,
  Phone,
  Home,
  Building2,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  Weight,
  Hash,
  ChevronRight,
  ArrowLeft,
  PackagePlus,
  Shield,
  Image as ImageIcon,
} from "lucide-react";

export default function ManagerShipmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shipment, setShipment] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [trackings, setTrackings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    try {
      setLoading(true);
      const res = await fetch(`/api/manager/shipments/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        router.push("/manager/shipments");
        return;
      }

      setShipment(data.shipment);
      setItems(data.items || []);
      setTrackings(data.trackings || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Status config untuk timeline
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string; step: number }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Menunggu Pembayaran", dot: "bg-yellow-500", step: 0 },
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Kurir Ditugaskan", dot: "bg-blue-500", step: 1 },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Paket Diambil", dot: "bg-indigo-500", step: 2 },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500", step: 3 },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: Building2, label: "Tiba di Cabang", dot: "bg-orange-500", step: 4 },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500", step: 5 },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500", step: 6 },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Dibatalkan", dot: "bg-red-500", step: 0 },
  };

  const paymentConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
  };

  // Tracking steps
  const trackingSteps = [
    { icon: Users, label: "Ditugaskan", status: "assigned" },
    { icon: Package, label: "Diambil", status: "picked_up" },
    { icon: Truck, label: "Perjalanan", status: "in_transit" },
    { icon: Building2, label: "Tiba Cabang", status: "arrived_at_branch" },
    { icon: MapPin, label: "Pengantaran", status: "out_for_delivery" },
    { icon: CheckCircle2, label: "Terkirim", status: "delivered" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat detail shipment...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Shipment Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Shipment yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => router.push("/manager/shipments")}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Shipments
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[shipment.status] || statusConfig.pending;
  const currentPayment = paymentConfig[shipment.payment_status] || paymentConfig.pending;
  const StatusIcon = currentStatus.icon;
  const PaymentIcon = currentPayment.icon;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/manager" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/manager/shipments" className="hover:text-red-600 transition-colors">
          Shipments
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Detail</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-red-600" />
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {shipment.tracking_number}
                </h1>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
                <StatusIcon size={14} />
                {currentStatus.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${currentPayment.bg} ${currentPayment.text}`}>
                <PaymentIcon size={14} />
                {currentPayment.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Detail lengkap pengiriman dan riwayat tracking (Read Only)
            </p>
          </div>
        </div>
      </div>

      {/* ============ PROGRESS TRACKING ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <Truck className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Progress Pengiriman</h2>
              <p className="text-sm text-gray-500">Status terkini paket</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStatus.step / 6) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index < currentStatus.step;
              const isCurrent = index === currentStatus.step - 1;

              return (
                <div key={index} className="relative flex flex-col items-center z-10 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-red-100" : ""}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className={`mt-3 text-xs font-semibold text-center ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="grid md:grid-cols-2 gap-6">
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

      {/* ============ ROUTE & SUMMARY ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
              <MapPin className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Rute & Ringkasan</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Route Visual */}
            <div>
              <div className="relative">
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

            {/* Summary Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Status Pengiriman</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {shipment.status.replaceAll("_", " ")}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Status Pembayaran</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {shipment.payment_status}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Total Berat</p>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  <Weight size={14} className="text-red-600" />
                  {shipment.total_weight} Kg
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Total Ongkir</p>
                <p className="font-bold text-red-600 flex items-center gap-1">
                  <DollarSign size={14} />
                  Rp {Number(shipment.total_price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ITEMS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Berat
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Package className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">Tidak ada data barang</p>
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
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
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                        {item.quantity} pcs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.weight} Kg</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.photo ? (
                        <div className="relative group inline-block">
                          <img
                            src={`/uploads/items/${item.photo}`}
                            alt={item.item_name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 group-hover:opacity-80 transition-opacity cursor-pointer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon size={20} className="text-white drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ TRACKING TIMELINE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Clock className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Riwayat Tracking</h2>
              <p className="text-sm text-gray-500">{trackings.length} update status</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {trackings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-gray-400" size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada tracking</h3>
              <p className="text-gray-500 text-sm">
                Update status akan muncul di sini saat kurir memperbarui perjalanan paket
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trackings.map((tracking: any, index) => {
                const trackStatus = statusConfig[tracking.status] || statusConfig.pending;
                const TrackIcon = trackStatus.icon;
                return (
                  <div key={tracking.id} className="relative flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trackStatus.bg} ${trackStatus.text} shadow-sm`}>
                        <TrackIcon size={18} />
                      </div>
                      {index < trackings.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent mt-2 min-h-[40px]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${trackStatus.bg} ${trackStatus.text}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${trackStatus.dot}`} />
                              {tracking.status.replaceAll("_", " ")}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900">{tracking.location}</h3>
                        </div>
                      </div>

                      {tracking.description && (
                        <p className="text-sm text-gray-600">{tracking.description}</p>
                      )}

                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(tracking.tracked_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============ MANAGER INFO BANNER ============ */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl flex-shrink-0">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-1">Mode Monitoring (Read Only)</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Halaman ini bersifat <strong>Read Only</strong>. Sebagai Manager, Anda hanya dapat memonitor proses pengiriman dan melihat riwayat tracking tanpa melakukan perubahan status. Untuk mengubah status, silakan hubungi Admin Cabang atau Kurir yang bertugas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}