"use client";

import {
  Truck,
  Zap,
  Package,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: "Regular",
      desc: "Pengiriman standar dengan harga ekonomis untuk seluruh Indonesia.",
      time: "2-3 hari",
      price: "Mulai Rp 10.000",
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      popular: false,
    },
    {
      icon: Zap,
      title: "Express",
      desc: "Pengiriman lebih cepat untuk kebutuhan yang mendesak dan prioritas.",
      time: "1-2 hari",
      price: "Mulai Rp 25.000",
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
      popular: true,
    },
    {
      icon: Package,
      title: "Cargo",
      desc: "Layanan khusus untuk paket besar dan berat dengan tarif kompetitif.",
      time: "3-5 hari",
      price: "Mulai Rp 50.000",
      color: "from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      popular: false,
    },
    {
      icon: Building2,
      title: "Antar Cabang",
      desc: "Distribusi paket antar cabang yang aman dan terintegrasi.",
      time: "1-3 hari",
      price: "Mulai Rp 15.000",
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      popular: false,
    },
  ];

  return (
    <section id="layanan" className="relative py-24 bg-white overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-40 -right-20 w-72 h-72 bg-red-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-40 -left-20 w-72 h-72 bg-orange-200 rounded-full opacity-20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            LAYANAN KAMI
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Pilih Layanan <span className="text-red-600">Terbaik</span>
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Berbagai pilihan layanan pengiriman yang dapat disesuaikan dengan 
            kebutuhan dan budget Anda.
          </p>

        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 overflow-hidden ${
                  service.popular 
                    ? `${service.borderColor} shadow-xl` 
                    : 'border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent'
                }`}
              >
                
                {/* Popular badge */}
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    POPULER
                  </div>
                )}

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`${service.bgLight} group-hover:bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300`}>
                    <Icon className={`${service.textColor} group-hover:text-white transition-colors duration-300`} size={32} />
                  </div>
                </div>

                {/* Title */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                    {service.title}
                  </h3>

                  {/* Time estimate */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className={`${service.textColor} group-hover:text-white/90 transition-colors duration-300`} size={16} />
                    <span className={`text-sm font-semibold ${service.textColor} group-hover:text-white/90 transition-colors duration-300`}>
                      Estimasi {service.time}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 group-hover:text-white/90 leading-relaxed text-sm mb-6 transition-colors duration-300">
                    {service.desc}
                  </p>

                  {/* Price */}
                  <div className="border-t border-gray-100 group-hover:border-white/20 pt-4 mb-6 transition-colors duration-300">
                    <p className="text-xs text-gray-400 group-hover:text-white/70 transition-colors duration-300">
                      {service.price}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full ${service.popular ? `bg-gradient-to-r ${service.color}` : 'bg-gray-100 group-hover:bg-white'} text-gray-900 group-hover:text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg`}>
                    <span>Pilih Layanan</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            *Harga dapat berubah sewaktu-waktu. Cek ongkir untuk harga terbaru.
          </p>
        </div>

      </div>
    </section>
  );
}