"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Receipt,
  Package,
  User,
  Phone,
  MapPin,
  DollarSign,
  CreditCard,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/cashier/payments/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        router.push("/cashier/payments");
        return;
      }

      setPayment(data);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: string) {
    const actionText = status === "paid" ? "konfirmasi pembayaran ini" : "tolak pembayaran ini";
    if (!confirm(`Yakin ingin ${actionText}?`)) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/cashier/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        router.push("/cashier/payments");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memperbarui status.");
    } finally {
      setUpdating(false);
    }
  }

  // Status config for badges
  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Gagal" },
    expired: { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle, label: "Expired" },
  };

  const currentStatus = statusConfig[payment?.payment_status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Pembayaran yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => router.push("/cashier/payments")}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/cashier" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/cashier/payments" className="hover:text-red-600 transition-colors">
          Pembayaran
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Detail</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Detail Pembayaran</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tinjau dan kelola status transaksi ini
          </p>
        </div>
      </div>

      {/* ============ MAIN CONTENT GRID ============ */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Transaction Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                  <Receipt className="text-white" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Informasi Transaksi</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-2.5 rounded-xl flex-shrink-0">
                  <Receipt className="text-red-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Nomor Invoice</p>
                  <p className="font-bold text-gray-900 text-lg">{payment.invoice_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2.5 rounded-xl flex-shrink-0">
                  <Package className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Nomor Resi</p>
                  <p className="font-semibold text-gray-900">{payment.tracking_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-50 p-2.5 rounded-xl flex-shrink-0">
                  <CreditCard className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {payment.payment_method?.replaceAll("_", " ") || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-2.5 rounded-xl flex-shrink-0">
                  <DollarSign className="text-emerald-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold text-emerald-600 text-2xl">
                    Rp {Number(payment.amount).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${currentStatus.bg}`}>
                  <StatusIcon className={currentStatus.text} size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Status Pembayaran</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
                    {currentStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <User className="text-white" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Detail Customer</h2>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                  <User className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                  <p className="font-semibold text-gray-900">{payment.customer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                  <Phone className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nomor Telepon</p>
                  <p className="font-semibold text-gray-900">{payment.customer_phone || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                  <MapPin className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Alamat</p>
                  <p className="font-semibold text-gray-900 leading-relaxed">
                    {payment.customer_address || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Card (Only if Pending) */}
          {payment.payment_status === "pending" && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Shield className="text-yellow-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Butuh Tindakan</h3>
                  <p className="text-xs text-gray-600">Pembayaran ini masih pending</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => updateStatus("paid")}
                  disabled={updating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  <span>Konfirmasi Lunas</span>
                </button>

                <button
                  onClick={() => updateStatus("failed")}
                  disabled={updating}
                  className="w-full bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span>Tolak Pembayaran</span>
                </button>
              </div>
            </div>
          )}

          {/* Status Info Card (If not pending) */}
          {payment.payment_status !== "pending" && (
            <div className={`rounded-2xl border p-6 ${
              payment.payment_status === "paid" 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  payment.payment_status === "paid" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {payment.payment_status === "paid" ? (
                    <CheckCircle2 className="text-green-600" size={24} />
                  ) : (
                    <XCircle className="text-red-600" size={24} />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold ${
                    payment.payment_status === "paid" ? "text-green-900" : "text-red-900"
                  }`}>
                    {payment.payment_status === "paid" ? "Pembayaran Selesai" : "Pembayaran Ditolak"}
                  </h3>
                  <p className={`text-xs ${
                    payment.payment_status === "paid" ? "text-green-700" : "text-red-700"
                  }`}>
                    Tidak ada tindakan lebih lanjut yang diperlukan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}