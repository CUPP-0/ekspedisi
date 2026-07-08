"use client";

import {
  ShieldCheck,
  Truck,
  Clock3,
  MapPinned,
} from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Truck,
      title: "Pengiriman Cepat",
      desc: "Paket diproses dan dikirim secepat mungkin oleh kurir profesional kami.",
      number: "01",
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      icon: ShieldCheck,
      title: "Paket Aman",
      desc: "Setiap pengiriman ditangani dengan standar keamanan dan asuransi terbaik.",
      number: "02",
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: MapPinned,
      title: "Tracking Real-time",
      desc: "Pantau posisi paket kapan saja dan dimana saja menggunakan nomor resi.",
      number: "03",
      color: "from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      icon: Clock3,
      title: "Layanan 24/7",
      desc: "Customer service siap membantu Anda kapan saja selama 24 jam nonstop.",
      number: "04",
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
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
            KEUNGGULAN KAMI
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Kenapa Harus <span className="text-red-600">Pilih Kami?</span>
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Kami berkomitmen memberikan layanan pengiriman terbaik dengan 
            kecepatan, keamanan, dan kemudahan yang tidak perlu diragukan.
          </p>

        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Number */}
                <div className="relative flex justify-between items-start mb-6">
                  <div className={`${item.bgLight} group-hover:bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300`}>
                    <Icon className={`${item.textColor} group-hover:text-white transition-colors duration-300`} size={28} />
                  </div>
                  <span className="text-5xl font-black text-gray-100 group-hover:text-white/20 transition-colors duration-300">
                    {item.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 group-hover:text-white/90 mt-3 text-sm leading-relaxed transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-white transition-colors duration-300">
                  <span>Selengkapnya</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}