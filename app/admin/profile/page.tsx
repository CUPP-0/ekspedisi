"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Shield,
  Building2,
  Save,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Key,
  BadgeCheck,
} from "lucide-react";

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    branch_name: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setForm({
        ...data,
        password: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      loadProfile();
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

  const userInitial = form.name.charAt(0).toUpperCase();
  const roleLabel = form.role === "admin" ? "Admin Cabang" : form.role === "manager" ? "Manager" : form.role;

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/dashboard" className="hover:text-red-600 transition-colors">
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
        </div>
      </div>

      {/* ============ PROFILE HEADER CARD ============ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
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
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl">
              {userInitial}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-full shadow-lg">
              <Shield size={16} className="text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BadgeCheck size={12} className="text-blue-400" />
              <span>{roleLabel}</span>
            </div>

            <h2 className="text-3xl font-bold mb-2">{form.name}</h2>
            <p className="text-white/90 mb-3 flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} />
              <span>{form.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Building2 size={14} />
                <span>{form.branch_name}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Shield size={14} />
                <span>Akun Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FORM SECTIONS ============ */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Informasi Personal</h2>
                <p className="text-sm text-gray-500">Data diri Anda</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User size={16} className="text-blue-600" />
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="text-blue-600" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Account Information (Readonly) */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Informasi Akun</h2>
                <p className="text-sm text-gray-500">Data akun yang tidak dapat diubah</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Shield size={16} className="text-orange-600" />
                Role
              </label>
              <div className="relative">
                <input
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-500 cursor-not-allowed"
                  value={roleLabel}
                />
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Lock size={14} className="text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Role tidak dapat diubah. Hubungi super admin jika diperlukan.</p>
            </div>

            {/* Branch */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building2 size={16} className="text-orange-600" />
                Cabang
              </label>
              <div className="relative">
                <input
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-500 cursor-not-allowed"
                  value={form.branch_name}
                />
                <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Lock size={14} className="text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Cabang tempat Anda bertugas saat ini.</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                <Key className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Keamanan</h2>
                <p className="text-sm text-gray-500">Ubah password untuk menjaga keamanan akun</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Lock size={16} className="text-green-600" />
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  placeholder="Kosongkan jika tidak ingin diubah"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimal 8 karakter dengan kombinasi huruf dan angka untuk keamanan optimal.
              </p>
            </div>

            {/* Security Info */}
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
                      <span>Gunakan password yang unik dan tidak digunakan di akun lain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ganti password secara berkala setiap 3 bulan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Jangan bagikan password kepada siapapun</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ ACTION BUTTONS ============ */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.history.back()}
            className="sm:w-auto border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-4 rounded-xl font-bold transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}