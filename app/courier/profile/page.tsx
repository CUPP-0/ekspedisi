"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Package,
  Truck,
  Clock,
  ChevronRight,
  ArrowLeft,
  BadgeCheck,
  Save,
} from "lucide-react";

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  branch_name: string;
  city: string;
  address: string;
  branch_phone: string;
}

interface Stats {
  assigned: number;
  in_progress: number;
  delivered: number;
}

export default function CourierProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [saving, setSaving] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    try {
      const res = await fetch("/api/courier/profile");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setProfile(data.profile);
      setStats(data.stats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function changePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/courier/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password berhasil diubah.");

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profil Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Data profil tidak tersedia.</p>
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

  const userInitial = profile.name.charAt(0).toUpperCase();
  const memberSince = new Date(profile.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/courier/dashboard" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Profile</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile Kurir</h1>
          <p className="text-sm text-gray-500 mt-1">Informasi akun dan statistik pengiriman Anda</p>
        </div>
      </div>

      {/* ============ PROFILE HEADER CARD ============ */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 rounded-2xl p-8 text-white relative overflow-hidden">
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
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-800 rounded-full opacity-30 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl">
              {userInitial}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-full shadow-lg">
              <Truck size={16} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BadgeCheck size={12} className="text-yellow-300" />
              <span>Kurir Aktif</span>
            </div>

            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <p className="text-white/90 mb-3 flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} />
              <span>{profile.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Phone size={14} />
                <span>{profile.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Building2 size={14} />
                <span>{profile.branch_name}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Calendar size={14} />
                <span>Bergabung {memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ STATS CARDS ============ */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Package className="text-blue-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Assigned</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.assigned}</h3>
          <p className="text-xs text-gray-400 mt-2">Paket ditugaskan</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
              Aktif
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Dalam Proses</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.in_progress}</h3>
          <p className="text-xs text-gray-400 mt-2">Sedang dikirim</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Delivered</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.delivered}</h3>
          <p className="text-xs text-gray-400 mt-2">Berhasil terkirim</p>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Courier Info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Informasi Kurir</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <User className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                <p className="font-semibold text-gray-900">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <Mail className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <Phone className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Nomor HP</p>
                <p className="font-semibold text-gray-900">{profile.phone || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <Shield className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-gray-900 capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <Calendar className="text-blue-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Bergabung</p>
                <p className="font-semibold text-gray-900">{memberSince}</p>
              </div>
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
              <h2 className="text-lg font-bold text-gray-900">Informasi Cabang</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <Building2 className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Nama Cabang</p>
                <p className="font-semibold text-gray-900">{profile.branch_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <MapPin className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Kota</p>
                <p className="font-semibold text-gray-900">{profile.city}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <MapPin className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Alamat</p>
                <p className="font-semibold text-gray-900">{profile.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <Phone className="text-orange-600" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Telepon Cabang</p>
                <p className="font-semibold text-gray-900">{profile.branch_phone || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ CHANGE PASSWORD ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
              <Key className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ubah Password</h2>
              <p className="text-sm text-gray-500">Ganti password untuk menjaga keamanan akun</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Old Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="text-green-600" />
              Password Lama <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Masukkan password lama"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Key size={16} className="text-green-600" />
              Password Baru <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Masukkan password baru"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CheckCircle2 size={16} className="text-green-600" />
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Ulangi password baru"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
              <CheckCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg flex-shrink-0">
                <Shield className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Tips Keamanan</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Gunakan password minimal 8 karakter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Kombinasikan huruf besar, kecil, dan angka</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Jangan gunakan password yang sama dengan akun lain</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={changePassword}
            disabled={saving || !passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Password</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}