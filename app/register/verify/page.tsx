'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Mail,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [countdown, setCountdown] = useState(60);
  const [email] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      alert('OTP wajib diisi 6 digit.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/customers/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert('Verifikasi berhasil.');
      router.push('/login/customer');
    } catch (err) {
      console.log(err);
      alert('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0) return;

    setResending(true);
    try {
      const res = await fetch('/api/customers/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert('OTP berhasil dikirim ulang ke email Anda.');
      setCountdown(60);
      setOtp(''); // Reset OTP input
    } catch (err) {
      console.log(err);
      alert('Terjadi kesalahan.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Decorative Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl" />

      {/* Main Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-8 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl shadow-lg shadow-red-200">
            <Package className="text-white" size={32} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
            <ShieldCheck className="text-blue-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi Email</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Masukkan kode OTP 6 digit yang telah dikirim ke
          </p>
          <p className="font-semibold text-gray-900 mt-1 flex items-center justify-center gap-2">
            <Mail size={14} className="text-gray-400" />
            {email || 'email Anda'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Kode OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full border border-gray-200 rounded-xl p-4 text-center text-3xl font-bold tracking-[0.5em] text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all placeholder:text-gray-300"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Kode OTP hanya berlaku untuk satu kali penggunaan
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Verifikasi Akun</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Resend Section */}
          <div className="text-center pt-4 border-t border-gray-100">
            {countdown > 0 ? (
              <p className="text-gray-500 text-sm">
                Kirim ulang kode dalam <span className="font-semibold text-red-600">{countdown}</span> detik
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
              >
                {resending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <span>Mengirim ulang...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={16} />
                    <span>Kirim Ulang OTP</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/login/customer"
            className="text-sm text-gray-500 hover:text-red-600 transition-colors inline-flex items-center gap-1 font-medium"
          >
            <ArrowRight className="rotate-180" size={14} />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}