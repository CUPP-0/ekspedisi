'use client';

import { Camera, User, Mail, Phone, Save, ArrowLeft, ChevronRight, AlertCircle, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CashierProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const res = await fetch('/api/cashier/profile');
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      });

      if (data.photo) {
        setPreview(`/uploads/users/${data.photo}`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function choosePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await fetch('/api/cashier/profile', {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message || 'Profil berhasil diperbarui.');
      getProfile(); // refresh data setelah update
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
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

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/cashier" className="hover:text-red-600 transition-colors">
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi profil dan akun Anda</p>
        </div>
      </div>

      {/* ============ PROFILE HEADER CARD ============ */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-800 rounded-full opacity-30 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl overflow-hidden">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white text-red-600 p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <Camera size={18} />
              <input hidden type="file" accept="image/*" onChange={choosePhoto} />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BadgeCheck size={12} className="text-yellow-300" />
              <span>Cashier Aktif</span>
            </div>

            <h2 className="text-3xl font-bold mb-2">{form.name || 'Nama Pengguna'}</h2>
            <p className="text-white/90 mb-3 flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} />
              <span>{form.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <Phone size={14} />
                <span>{form.phone || 'Belum diisi'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                <CheckCircle2 size={14} />
                <span>Akun Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ PROFILE FORM ============ */}
      <form onSubmit={saveProfile} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Informasi Personal</h2>
              <p className="text-sm text-gray-500">Perbarui data diri Anda</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
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

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone size={16} className="text-blue-600" />
              Nomor HP
            </label>
            <input
              type="tel"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              type="button"
              onClick={() => window.history.back()}
              className="sm:w-auto border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-3.5 rounded-xl font-bold transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}