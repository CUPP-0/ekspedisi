"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Truck, Search, MapPin, Package, Clock, ShieldCheck } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [tracking, setTracking] = useState("");

  function submit() {
    if (!tracking.trim()) return;
    router.push(`/tracking/${tracking}`);
  }

  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-28 pb-20 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 overflow-hidden">
        
        {/* Background pattern (subtle dots) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-800 rounded-full opacity-30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
              #1 Jasa Pengiriman Terpercaya di Indonesia
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold mt-6 leading-tight tracking-tight">
              Kirim Paket <br />
              <span className="text-yellow-300">Cepat, Aman,</span> <br />
              ke Seluruh Indonesia
            </h1>

            <p className="text-white/90 mt-6 text-lg max-w-lg leading-relaxed">
              Solusi pengiriman modern dengan tracking real-time, 
              jangkauan luas, dan harga terjangkau. Dipercaya jutaan pelanggan.
            </p>

            {/* ===== TRACKING FORM (Signature Feature) ===== */}
            <div className="mt-8 bg-white rounded-2xl p-2 shadow-2xl max-w-xl">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-3">
                  <Search className="text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Masukkan nomor resi (AWB) untuk lacak paket..."
                    className="w-full outline-none text-gray-800 placeholder:text-gray-400"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                  />
                </div>
                <button
                  onClick={submit}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
                >
                  Lacak Paket
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-8 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-yellow-300" />
                <span>Asuransi Paket</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-yellow-300" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-yellow-300" />
                <span>514+ Kota/Kabupaten</span>
              </div>
            </div>
          </div>

          {/* Right - Truck Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Glow background */}
            <div className="absolute w-80 h-80 bg-yellow-300 rounded-full opacity-30 blur-3xl" />
            
            {/* Main circle */}
            <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full w-80 h-80 lg:w-96 lg:h-96 flex items-center justify-center shadow-2xl">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center shadow-xl">
                <Truck size={140} className="text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute top-10 -left-4 bg-white rounded-xl p-3 shadow-xl flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Package className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Paket Terkirim</p>
                <p className="font-bold text-gray-800">12.5M+</p>
              </div>
            </div>

            <div className="absolute bottom-10 -right-4 bg-white rounded-xl p-3 shadow-xl flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <MapPin className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Jangkauan</p>
                <p className="font-bold text-gray-800">Seluruh Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUICK SERVICES STRIP ============ */}
      <section className="relative -mt-10 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            
            <Link href="/cek-ongkir" className="group p-6 flex flex-col items-center text-center hover:bg-red-50 transition-colors rounded-l-2xl">
              <div className="bg-red-100 group-hover:bg-red-600 p-3 rounded-xl transition-colors">
                <MapPin className="text-red-600 group-hover:text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mt-3">Cek Ongkir</h3>
              <p className="text-xs text-gray-500 mt-1">Hitung biaya kirim</p>
            </Link>

            <Link href="/lacak" className="group p-6 flex flex-col items-center text-center hover:bg-red-50 transition-colors">
              <div className="bg-orange-100 group-hover:bg-orange-600 p-3 rounded-xl transition-colors">
                <Search className="text-orange-600 group-hover:text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mt-3">Lacak Paket</h3>
              <p className="text-xs text-gray-500 mt-1">Tracking real-time</p>
            </Link>

            <Link href="/kirim" className="group p-6 flex flex-col items-center text-center hover:bg-red-50 transition-colors">
              <div className="bg-yellow-100 group-hover:bg-yellow-600 p-3 rounded-xl transition-colors">
                <Package className="text-yellow-600 group-hover:text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mt-3">Kirim Paket</h3>
              <p className="text-xs text-gray-500 mt-1">Mulai pengiriman</p>
            </Link>

            <Link href="/layanan" className="group p-6 flex flex-col items-center text-center hover:bg-red-50 transition-colors rounded-r-2xl">
              <div className="bg-blue-100 group-hover:bg-blue-600 p-3 rounded-xl transition-colors">
                <Truck className="text-blue-600 group-hover:text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mt-3">Layanan Kami</h3>
              <p className="text-xs text-gray-500 mt-1">Pilih jenis layanan</p>
            </Link>

          </div>
        </div>
      </section>
    </>
  );
}