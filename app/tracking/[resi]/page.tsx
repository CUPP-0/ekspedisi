"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  Truck,
  Clock,
  ArrowLeft,
  Home,
  Building2,
  DollarSign,
  Weight,
  CheckCircle2,
  Users,
  AlertCircle,
  Calendar,
  Phone,
  ChevronRight,
  PackagePlus,
  Hash,
} from "lucide-react";

export default function TrackingPage() {
  const { resi } = useParams();

  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [trackings, setTrackings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any>(null);

  useEffect(() => {
    loadTracking();
  }, []);

  async function loadTracking() {
    try {
      const res = await fetch(`/api/tracking/${resi}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipment(data.shipment);
      setItems(data.items || []);
      setTrackings(data.trackings || []);
      setPayments(data.payments || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function statusColor(payment_status: string) {
    switch (payment_status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "paid":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function statusLabel(payment_status: string) {
    switch (payment_status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "paid":
        return "Sudah Dibayar";
      default:
        return payment_status;
    }
  }

  // Status config untuk tracking timeline
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat data tracking...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Resi Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Nomor resi yang Anda cari tidak tersedia.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const currentTrackingStatus = trackings.length > 0 ? trackings[0].status : null;
  const currentStatusConfig = currentTrackingStatus ? statusConfig[currentTrackingStatus] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-8 space-y-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>

        {/* ============ HERO SECTION ============ */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-800 rounded-full opacity-30 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-lg">
                <Package size={40} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Nomor Resi</p>
                <h1 className="text-3xl font-bold mb-3">{shipment.tracking_number}</h1>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${statusColor(payments?.[0]?.payment_status)}`}>
                  {payments?.[0]?.payment_status === "paid" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  {statusLabel(payments?.[0]?.payment_status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-white/80 text-xs mb-1">Berat</p>
                <div className="font-bold text-xl flex items-center gap-2">
                  <Weight size={18} />
                  {shipment.total_weight} Kg
                </div>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">Ongkir</p>
                <div className="font-bold text-xl flex items-center gap-2">
                  <DollarSign size={18} />
                  Rp {Number(shipment.total_price).toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">Cabang Asal</p>
                <div className="font-semibold flex items-center gap-2">
                  <MapPin size={14} />
                  {shipment.origin_branch}
                </div>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">Cabang Tujuan</p>
                <div className="font-semibold flex items-center gap-2">
                  <Home size={14} />
                  {shipment.destination_branch}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ TIMELINE TRACKING ============ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-8 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Riwayat Tracking</h2>
                <p className="text-sm text-gray-500">Perjalanan paket Anda</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {trackings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-gray-400" size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Riwayat</h3>
                <p className="text-gray-500 text-sm">
                  Tracking akan muncul ketika kurir memperbarui status pengiriman
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {trackings.map((tracking: any, index: number) => {
                  const trackStatus = statusConfig[tracking.status] || statusConfig.pending;
                  const TrackIcon = trackStatus.icon;
                  const isFirst = index === 0;

                  return (
                    <div key={tracking.id} className="flex gap-5 group">
                      {/* Timeline Indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            isFirst
                              ? "bg-gradient-to-br from-red-500 to-orange-500 text-white ring-4 ring-red-100"
                              : `${trackStatus.bg} ${trackStatus.text}`
                          }`}
                        >
                          <TrackIcon size={20} />
                        </div>
                        {index !== trackings.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-300 to-transparent mt-2 min-h-[40px]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 group-hover:bg-white group-hover:border-red-200 border border-gray-100 rounded-xl p-5 transition-all">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${trackStatus.bg} ${trackStatus.text}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${trackStatus.dot}`} />
                                  {tracking.status.replaceAll("_", " ")}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg text-gray-900">{tracking.location}</h3>
                            </div>
                            {isFirst && (
                              <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                                Terkini
                              </span>
                            )}
                          </div>

                          {tracking.description && (
                            <p className="text-gray-600 mt-2">{tracking.description}</p>
                          )}

                          <p className="text-sm text-gray-400 mt-3 flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(tracking.tracked_at).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ============ PENGIRIM & PENERIMA ============ */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pengirim */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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

          {/* Penerima */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <MapPin className="text-white" size={20} />
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

        {/* ============ DAFTAR BARANG ============ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Berat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12">
                      <Package className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 font-medium">Tidak ada data barang</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 w-9 h-9 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-indigo-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{item.item_name}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                          {item.quantity} pcs
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="text-sm font-medium text-gray-700">{item.weight} Kg</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============ INFORMASI PENGIRIMAN ============ */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                <Truck className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Informasi Pengiriman</h2>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <MapPin className="text-orange-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Cabang Asal</p>
                <p className="font-semibold text-gray-900">{shipment.origin_branch}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <Home className="text-orange-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Cabang Tujuan</p>
                <p className="font-semibold text-gray-900">{shipment.destination_branch}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                <Weight className="text-green-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Berat Total</p>
                <p className="font-semibold text-gray-900">{shipment.total_weight} Kg</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-red-50 p-2 rounded-lg flex-shrink-0">
                <DollarSign className="text-red-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Ongkir</p>
                <p className="font-bold text-red-600 text-lg">
                  Rp {Number(shipment.total_price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <CheckCircle2 className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status Pembayaran</p>
                <p className="font-semibold text-gray-900 capitalize">{shipment.payment_status}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                <Truck className="text-purple-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status Pengiriman</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {shipment.status.replaceAll("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============ FOOTER CTA ============ */}
        <div className="text-center py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}