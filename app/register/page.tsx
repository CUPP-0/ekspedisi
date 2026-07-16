'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  User,
  Truck,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  city: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<'customer' | 'courier'>('customer');
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    branch_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadBranches();
  }, []);

  async function loadBranches() {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();

      if (res.ok) {
        setBranches(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Konfirmasi password tidak sama.');
      return;
    }

    if (accountType === 'courier' && !form.branch_id) {
      alert('Pilih cabang.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = accountType === 'customer' ? '/api/customers/register' : '/api/courier/register';

      const body: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      };

      if (accountType === 'customer') {
        body.city = form.city;
      }

      if (accountType === 'courier') {
        body.branch_id = form.branch_id;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert('OTP telah dikirim ke email.');
      router.push(`/register/verify?email=${form.email}`);
    } catch (err) {
      console.log(err);
      alert('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  // Check if passwords match for visual feedback
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

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
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Bergabunglah dengan <br />
              <span className="text-yellow-300">BAZMA Express</span>
            </h2>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              Daftar sekarang untuk menikmati layanan pengiriman cepat, aman, dan terjangkau ke seluruh Indonesia.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <CheckCircle2 size={20} className="text-yellow-300" />
                </div>
                <div>
                  <p className="font-semibold">Registrasi Cepat & Mudah</p>
                  <p className="text-sm text-white/80">Proses verifikasi otomatis via email</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <CheckCircle2 size={20} className="text-yellow-300" />
                </div>
                <div>
                  <p className="font-semibold">Pilihan Akun Fleksibel</p>
                  <p className="text-sm text-white/80">Daftar sebagai Customer atau Mitra Kurir</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/20">
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

      {/* ============ RIGHT: REGISTER FORM ============ */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-xl">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
              <p className="text-gray-500">Pilih jenis akun dan lengkapi data diri Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Branch Select (Courier Only) */}
              {accountType === 'courier' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building2 size={16} className="text-red-600" />
                    Pilih Cabang <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    value={form.branch_id}
                    onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                    required
                  >
                    <option value="">-- Pilih Cabang --</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} - {branch.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} className="text-red-600" />
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    placeholder="Masukkan nama lengkap"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="text-red-600" />
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    placeholder="contoh@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock size={16} className="text-red-600" />
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
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
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <CheckCircle2 size={16} className={passwordsMatch ? 'text-green-600' : 'text-red-600'} />
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:ring-2 transition-all ${
                      passwordsMismatch
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                        : passwordsMatch
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-100'
                        : 'border-gray-200 focus:border-red-500 focus:ring-red-100'
                    }`}
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                  <CheckCircle2
                    size={16}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      passwordsMismatch ? 'text-red-400' : passwordsMatch ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordsMismatch && (
                  <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                )}
              </div>

              {/* City (Customer Only) */}
              {accountType === 'customer' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="text-red-600" />
                    Kota
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                      placeholder="Contoh: Jakarta"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="text-red-600" />
                  Nomor HP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="text-red-600" />
                  Alamat <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                    placeholder="Masukkan alamat lengkap"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                  <MapPin size={16} className="absolute left-4 top-3 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>{accountType === 'customer' ? 'Daftar Customer' : 'Daftar Sebagai Kurir'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-red-600 font-semibold hover:underline inline-flex items-center gap-1">
                  Login di sini
                  <ArrowRight size={14} />
                </Link>
              </p>
            </div>

            {/* Courier Info Banner */}
            {accountType === 'courier' && (
              <div className="mt-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Informasi Pendaftaran Kurir</p>
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    Setelah mendaftar, akun Anda akan ditinjau oleh admin cabang terlebih dahulu. Anda dapat login dan mulai bekerja setelah lamaran disetujui.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}