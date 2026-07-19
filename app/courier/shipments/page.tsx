"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  ChevronRight,
  Eye,
  Hash,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface Shipment {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  status: string;
  payment_status: string;
  created_at?: string;
}

export default function CourierShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    try {
      setLoading(true);
      const res = await fetch("/api/courier/shipments");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: shipments.length,
      active: shipments.filter((s) => s.status !== "delivered").length,
      delivered: shipments.filter((s) => s.status === "delivered").length,
    };
  }, [shipments]);

  // Status config untuk badge yang konsisten
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Ditugaskan", dot: "bg-blue-500" },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Diambil", dot: "bg-indigo-500" },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500" },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: MapPin, label: "Tiba di Cabang", dot: "bg-orange-500" },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500" },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500" },
  };

  const paymentConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat daftar shipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/courier/dashboard" className="hover:text-orange-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Shipment Saya</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Shipment Saya
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar pengiriman yang ditugaskan kepada Anda
          </p>
        </div>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Package className="text-orange-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Shipment</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Truck className="text-blue-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              Aktif
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Sedang Diproses</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.active}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              Selesai
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Berhasil Dikirim</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.delivered}</h3>
        </div>
      </div>

      {/* ============ SHIPMENTS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {shipments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada shipment</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Shipment yang ditugaskan kepada Anda akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    No. Resi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pengirim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Penerima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map((shipment) => {
                  const statusCfg = statusConfig[shipment.status] || statusConfig.assigned;
                  const paymentCfg = paymentConfig[shipment.payment_status] || paymentConfig.pending;
                  const StatusIcon = statusCfg.icon;
                  const PaymentIcon = paymentCfg.icon;

                  return (
                    <tr key={shipment.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <Hash size={16} className="text-orange-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {shipment.tracking_number}
                            </p>
                            {shipment.created_at && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Calendar size={10} />
                                {new Date(shipment.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {shipment.sender_name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {shipment.sender_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {shipment.receiver_name?.charAt(0).toUpperCase() || "R"}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {shipment.receiver_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${paymentCfg.bg} ${paymentCfg.text}`}
                        >
                          <PaymentIcon size={12} />
                          {paymentCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/courier/shipments/${shipment.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 opacity-70 group-hover:opacity-100 transition-opacity"
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
        )}
      </div>
    </div>
  );
}