'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Mail, Lock, Shield, Users, Truck, ArrowRight, Eye, EyeOff, Building2 } from 'lucide-react';

export default function InternalLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      switch (data.role) {
        case 'admin-pusat':
          router.push('/admin-pusat/dashboard');
          break;

        case 'manager':
          router.push('/manager/dashboard');
          break;

        case 'admin':
          router.push('/admin/dashboard');
          break;

        case 'courier':
          router.push('/courier/dashboard');
          break;

        case 'cashier':
          router.push('/cashier');
          break;

        default:
          alert('Role tidak dikenali.');
          break;
      }
    } catch (err) {
      console.log(err);
      alert('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ============ LEFT: BRANDING SECTION ============ */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">
                BAZMA <span className="text-blue-400">Express</span>
              </h1>
              <p className="text-sm text-white/80">Internal Management System</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
              <Shield size={16} className="text-blue-400" />
              <span>Portal Internal Karyawan</span>
            </div>

            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Kelola <br />
              <span className="text-blue-400">Operasional</span> <br />
              dengan Mudah
            </h2>

            <p className="text-white/90 text-lg leading-relaxed mb-8">Platform terpadu untuk admin, manager, dan kurir dalam mengelola pengiriman, tracking paket, dan operasional harian.</p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="font-semibold">Admin Panel</p>
                  <p className="text-sm text-white/80">Kelola cabang & karyawan</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <p className="font-semibold">Manager Dashboard</p>
                  <p className="text-sm text-white/80">Monitoring & reporting</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-semibold">Courier App</p>
                  <p className="text-sm text-white/80">Update status pengiriman</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-blue-400" />
              <div>
                <p className="font-semibold">Akses Terbatas</p>
                <p className="text-sm text-white/80">Hanya untuk karyawan internal BAZMA Express</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT: LOGIN FORM ============ */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2.5 rounded-xl">
              <Package className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                BAZMA <span className="text-blue-600">Express</span>
              </h1>
              <p className="text-xs text-gray-500">Internal Management System</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg shadow-slate-300">
                <Shield className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Login Internal</h2>
              <p className="text-gray-500">Masuk untuk admin, manager, atau kurir</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="text-blue-600" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="karyawan@bazmaexpress.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock size={16} className="text-blue-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-300 hover:shadow-slate-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Customer Login Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Login sebagai customer?{' '}
                  <Link href="/login/customer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                    Klik di sini
                    <ArrowRight size={14} />
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>
              Butuh bantuan? Hubungi{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                IT Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
