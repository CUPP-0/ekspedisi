"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  X,
  FileText,
  UserCheck,
  UserX,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface Application {
  id: number;
  branch_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  branch_name: string;
  branch_city: string;
  rejection_reason: string | null;
}

export default function DetailCourierApplicationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/courier-applications/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        router.back();
        return;
      }

      setApplication(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    if (!confirm("Approve kurir ini?")) return;

    setProcessing(true);

    try {
      const res = await fetch(`/api/admin/courier-applications/${id}/approve`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Kurir berhasil disetujui.");
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }

  async function reject() {
    setProcessing(true);

    try {
      const res = await fetch(`/api/admin/courier-applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Lamaran berhasil ditolak.");
      setShowReject(false);
      setReason("");
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }

  // Status config
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Menunggu Review", dot: "bg-yellow-500" },
    approved: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Disetujui", dot: "bg-green-500" },
    rejected: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Ditolak", dot: "bg-red-500" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat detail lamaran...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lamaran Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Lamaran yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => router.push("/admin/courier-applications")}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Lamaran
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[application.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const userInitial = application.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/dashboard" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/admin/courier-applications" className="hover:text-red-600 transition-colors">
          Lamaran Kurir
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
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Detail Lamaran
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Informasi lengkap pelamar kurir
            </p>
          </div>
        </div>
      </div>

      {/* ============ APPLICANT PROFILE CARD ============ */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
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

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl">
            {userInitial}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">{application.name}</h2>
            <p className="text-white/90 mb-3 flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} />
              <span>{application.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Phone size={14} />
                <span>{application.phone}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Building2 size={14} />
                <span>{application.branch_name}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <MapPin size={14} />
                <span>{application.branch_city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Informasi Personal</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <User className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                <p className="font-semibold text-gray-900">{application.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <Mail className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{application.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <Phone className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Nomor HP</p>
                <p className="font-semibold text-gray-900">{application.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <MapPin className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Alamat</p>
                <p className="font-semibold text-gray-900">{application.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                <FileText className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Informasi Lamaran</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <Building2 className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Cabang Tujuan</p>
                <p className="font-semibold text-gray-900">{application.branch_name}</p>
                <p className="text-xs text-gray-500">{application.branch_city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <Calendar className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Tanggal Daftar</p>
                <p className="font-semibold text-gray-900">
                  {new Date(application.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(application.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {application.approved_at && (
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="text-green-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Tanggal Disetujui</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(application.approved_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(application.approved_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className={`${status.bg} p-2 rounded-lg flex-shrink-0`}>
                <StatusIcon className={status.text} size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ STATUS & ACTION CARDS ============ */}
      {application.status === "pending" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Review Lamaran</h2>
                <p className="text-sm text-gray-500">Setujui atau tolak lamaran ini</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">Menunggu Keputusan</p>
                  <p className="text-sm text-yellow-700">
                    Lamaran ini belum diproses. Silakan review informasi pelamar di atas, lalu pilih aksi di bawah.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={approve}
                disabled={processing}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-200 hover:shadow-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp size={22} />
                    <div className="text-left">
                      <p className="text-base">Setujui</p>
                      <p className="text-xs text-white/80 font-normal">Terima sebagai kurir</p>
                    </div>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowReject(true)}
                disabled={processing}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ThumbsDown size={22} />
                <div className="text-left">
                  <p className="text-base">Tolak</p>
                  <p className="text-xs text-white/80 font-normal">Tolak lamaran ini</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ APPROVED STATE ============ */}
      {application.status === "approved" && (
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <UserCheck size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Kurir Telah Disetujui</h3>
              <p className="text-white/90 text-sm">
                {application.name} telah resmi menjadi kurir di cabang {application.branch_name}.
                {application.approved_at && (
                  <span>
                    {" "}Disetujui pada{" "}
                    {new Date(application.approved_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    .
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ REJECTED STATE ============ */}
      {application.status === "rejected" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg">
                <UserX className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-red-900">Lamaran Ditolak</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Alasan Penolakan</h3>
                  <p className="text-red-800 text-sm leading-relaxed">
                    {application.rejection_reason || "Tidak ada alasan yang diberikan."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ REJECT MODAL ============ */}
      {showReject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg">
                  <UserX className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Tolak Lamaran</h2>
                  <p className="text-xs text-gray-500">Berikan alasan penolakan</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReject(false);
                  setReason("");
                }}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {userInitial}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{application.name}</p>
                  <p className="text-sm text-gray-500">{application.email}</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={14} className="text-red-600" />
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                  placeholder="Contoh: Dokumen tidak lengkap, tidak memenuhi persyaratan..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Alasan ini akan dikirimkan ke pelamar melalui email
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReject(false);
                  setReason("");
                }}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all"
              >
                Batal
              </button>
              <button
                onClick={reject}
                disabled={processing || !reason.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <UserX size={16} />
                    <span>Tolak Lamaran</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}