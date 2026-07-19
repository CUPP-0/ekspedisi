'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, User, Search, LogOut, ArrowLeft, ChevronRight, Bell, Menu, X, MapPin, Phone, Mail, Calendar, Save, Camera, Shield, Award, Star, Edit3, CheckCircle2, Clock, Hash } from 'lucide-react';

export default function CustomerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    created_at: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch('/api/customers/profile');
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        photo: data.photo || '',
        created_at: data.created_at || '',
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('address', form.address);

      if (photo) {
        formData.append('photo', photo);
      }

      const res = await fetch('/api/customers/profile', {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert('Profil berhasil diperbarui.');

      // kalau mau langsung update preview setelah upload
      setForm((prev) => ({
        ...prev,
        photo: data.photo,
      }));
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  const preview = photo ? URL.createObjectURL(photo) : form?.photo ? `/uploads/customers/${form.photo}` : null;

  // Menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard', active: false },
    { icon: Package, label: 'Shipments', href: '/customer/shipments', active: false },
    { icon: User, label: 'Profile', href: '/customer/profile', active: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const userInitial = form.name.charAt(0).toUpperCase();
  const memberSince = new Date(form.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
            <button onClick={() => router.push('/login/customer')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all">
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
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">{userInitial}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{form.name}</p>
                  <p className="text-xs text-gray-500 leading-tight">Customer</p>
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
            <span className="text-gray-900 font-semibold">Profile</span>
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profil Saya</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola informasi profil Anda</p>
            </div>
          </div>

          {/* ============ PROFILE HEADER CARD ============ */}
          <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden mb-6">
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
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-white/20 backdrop-blur-sm">
                  {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white">{userInitial}</div>}
                </div>

                <label htmlFor="photo" className="absolute bottom-0 right-0 bg-white text-red-600 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={18} />
                </label>

                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setPhoto(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  <Star size={12} className="text-yellow-300 fill-yellow-300" />
                  <span>Member</span>
                </div>

                <h2 className="text-3xl font-bold mb-2">{form.name}</h2>
                <p className="text-white/90 mb-3">{form.email}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Calendar size={14} />
                    <span>Bergabung: {memberSince}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <Shield size={14} />
                    <span>Akun Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ PROFILE FORM ============ */}
          <form onSubmit={saveProfile} className="space-y-6">
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

            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Informasi Kontak</h2>
                    <p className="text-sm text-gray-500">Cara menghubungi Anda</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="text-green-600" />
                    Nomor HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-green-600" />
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                    placeholder="Masukkan alamat lengkap"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Alamat ini akan digunakan sebagai alamat default untuk pengiriman</p>
                </div>
              </div>
            </div>

            {/* ============ SECURITY INFO ============ */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl flex-shrink-0">
                  <Shield className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Keamanan Akun</h3>
                  <p className="text-sm text-gray-600 mb-4">Data Anda dilindungi dengan enkripsi end-to-end</p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Email Terverifikasi</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Password Aman</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ ACTION BUTTONS ============ */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
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

              <button type="button" onClick={() => router.back()} className="sm:w-auto border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 px-6 py-4 rounded-xl font-bold transition-all">
                Batal
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
