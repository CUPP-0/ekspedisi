"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Users,
  Truck,
  Building2,
} from "lucide-react";

export default function Statistics() {
  const [stats, setStats] = useState({
    shipments: 0,
    customers: 0,
    couriers: 0,
    branches: 0,
  });

  const [displayStats, setDisplayStats] = useState({
    shipments: 0,
    customers: 0,
    couriers: 0,
    branches: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    try {
      const res = await fetch("/api/statistics");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  }

  // Count-up animation
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayStats({
        shipments: Math.floor(stats.shipments * progress),
        customers: Math.floor(stats.customers * progress),
        couriers: Math.floor(stats.couriers * progress),
        branches: Math.floor(stats.branches * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayStats(stats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const items = [
    {
      icon: Package,
      value: displayStats.shipments,
      title: "Paket Terkirim",
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-500/20",
    },
    {
      icon: Users,
      value: displayStats.customers,
      title: "Customer Aktif",
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-500/20",
    },
    {
      icon: Truck,
      value: displayStats.couriers,
      title: "Kurir Profesional",
      color: "from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-500/20",
    },
    {
      icon: Building2,
      value: displayStats.branches,
      title: "Cabang Tersebar",
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-500/20",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-800 rounded-full opacity-30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
            STATISTIK KAMI
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Dipercaya <span className="text-yellow-300">Jutaan</span> Pelanggan
          </h2>

          <p className="mt-4 text-white/90 text-lg">
            Kami terus berkembang untuk memberikan layanan pengiriman terbaik 
            ke seluruh Indonesia.
          </p>

        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                
                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                {/* Icon */}
                <div className="relative flex justify-center mb-6">
                  <div className={`${item.bgLight} group-hover:scale-110 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300`}>
                    <Icon 
                      size={40} 
                      className="text-white group-hover:rotate-12 transition-transform duration-300" 
                    />
                  </div>
                </div>

                {/* Number */}
                <div className="relative">
                  <h3 className="text-5xl font-extrabold mb-2">
                    {Number(item.value).toLocaleString("id-ID")}
                    <span className="text-yellow-300">+</span>
                  </h3>
                  <p className="text-white/90 font-medium">
                    {item.title}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />

              </div>
            );
          })}

        </div>

        {/* Bottom trust indicator */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">⭐</div>
              <div className="w-8 h-8 bg-red-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">✓</div>
              <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">★</div>
            </div>
            <p className="text-sm font-medium">
              Rating 4.9/5 dari 10.000+ ulasan pelanggan
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}