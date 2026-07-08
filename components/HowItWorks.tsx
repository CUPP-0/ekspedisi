"use client";

import {
  UserPlus,
  PackagePlus,
  CreditCard,
  UserCheck,
  Truck,
  House,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Daftar",
      desc: "Buat akun customer untuk mulai menggunakan layanan pengiriman.",
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: PackagePlus,
      title: "Buat Pengiriman",
      desc: "Isi data pengirim, penerima, dan barang yang akan dikirim.",
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: CreditCard,
      title: "Pembayaran",
      desc: "Lakukan pembayaran agar pengiriman dapat diproses.",
      color: "from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      icon: UserCheck,
      title: "Admin Assign Kurir",
      desc: "Admin cabang menugaskan kurir untuk mengambil paket.",
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: Truck,
      title: "Pengiriman",
      desc: "Kurir mengambil paket dan memperbarui status tracking hingga tujuan.",
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: House,
      title: "Paket Diterima",
      desc: "Paket berhasil diterima oleh penerima dan pengiriman selesai.",
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-red-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-orange-200 rounded-full opacity-20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            CARA KERJA
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Cara <span className="text-red-600">Pengiriman</span>
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Hanya dengan beberapa langkah mudah, paket Anda siap dikirim 
            ke seluruh Indonesia dengan aman dan cepat.
          </p>

        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">

          {steps.map((step, index) => {
            const Icon = step.icon;
            const stepNumber = String(index + 1).padStart(2, '0');

            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Step number badge */}
                <div className="relative flex justify-between items-start mb-6">
                  <div className={`${step.bgLight} group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300`}>
                    <Icon className={`${step.textColor} group-hover:text-white transition-colors duration-300`} size={32} />
                  </div>
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg shadow-lg`}>
                    {stepNumber}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-white/90 leading-relaxed text-sm transition-colors duration-300">
                    {step.desc}
                  </p>
                </div>

                {/* Connecting arrow (only for non-last items in row) */}
                {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="bg-white shadow-lg rounded-full p-2 border border-gray-100">
                      <ArrowRight className="text-gray-400" size={20} />
                    </div>
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-6 rounded-2xl shadow-xl">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold">Siap Mulai Kirim?</h3>
              <p className="text-white/90 text-sm mt-1">Daftar sekarang dan nikmati kemudahan pengiriman</p>
            </div>
            <a
              href="/register"
              className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Daftar Gratis
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}