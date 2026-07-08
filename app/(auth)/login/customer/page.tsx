'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';
import Link from 'next/link';
import { Package, Mail, Lock, User, Truck, Shield, Star, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (!captchaToken) {
        alert('Silakan selesaikan verifikasi CAPTCHA.');
        return;
      }

      if (!res.ok) {
        alert(data.message);
        setCaptchaToken('');
        return;
      }

      router.push('/customer/dashboard');
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
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
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-800 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400 rounded-full opacity-10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">
                BAZMA <span className="text-yellow-300">Express</span>
              </h1>
              <p className="text-sm text-white/80">Solusi Pengiriman Terpercaya</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
              <Sparkles size={16} className="text-yellow-300" />
              <span>#1 Jasa Pengiriman di Indonesia</span>
            </div>

            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Kirim Paket <br />
              <span className="text-yellow-300">Cepat, Aman,</span> <br />
              ke Seluruh Indonesia
            </h2>

            <p className="text-white/90 text-lg leading-relaxed mb-8">Bergabunglah dengan jutaan pelanggan yang mempercayakan pengiriman mereka kepada kami. Tracking real-time, harga terjangkau, dan layanan 24/7.</p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-semibold">Pengiriman Cepat</p>
                  <p className="text-sm text-white/80">Estimasi 1-3 hari kerja</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-semibold">Paket Aman</p>
                  <p className="text-sm text-white/80">Asuransi & tracking real-time</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Star size={20} className="text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <p className="font-semibold">Terpercaya</p>
                  <p className="text-sm text-white/80">Rating 4.9/5 dari 10.000+ pelanggan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-extrabold text-yellow-300">12.5M+</p>
              <p className="text-sm text-white/80">Paket Terkirim</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-yellow-300">514+</p>
              <p className="text-sm text-white/80">Kota/Kabupaten</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-yellow-300">24/7</p>
              <p className="text-sm text-white/80">Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT: LOGIN FORM ============ */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2.5 rounded-xl">
              <Package className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                BAZMA <span className="text-red-600">Express</span>
              </h1>
              <p className="text-xs text-gray-500">Solusi Pengiriman Terpercaya</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-4 shadow-lg shadow-red-200">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Login Customer</h2>
              <p className="text-gray-500">Masuk ke akun customer Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="text-red-600" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    placeholder="contoh@email.com"
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
                  <Lock size={16} className="text-red-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
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
              <div className="mt-5">
                <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={(token) => setCaptchaToken(token)} onExpire={() => setCaptchaToken('')} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <Link href="/register" className="text-red-600 font-semibold hover:underline inline-flex items-center gap-1">
                    Daftar Sekarang
                    <ArrowRight size={14} />
                  </Link>
                </p>
              </div>

              {/* Internal Login Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Login sebagai internal?{' '}
                  <Link href="/login/internal" className="text-red-600 font-semibold hover:underline inline-flex items-center gap-1">
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
              Dengan masuk, Anda menyetujui{' '}
              <Link href="/terms" className="text-red-600 hover:underline">
                Syarat & Ketentuan
              </Link>{' '}
              kami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
