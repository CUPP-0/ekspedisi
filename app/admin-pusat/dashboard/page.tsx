"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Shield,
  Package,
  Calendar,
  ArrowUpRight,
  BadgeDollarSign,
  Truck,
  MapPin,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  // Quick actions untuk navigasi cepat
  const quickActions = [
    {
      icon: Building2,
      label: "Kelola Cabang",
      desc: "Tambah/edit cabang",
      href: "/admin-pusat/branches",
      color: "bg-red-600",
    },
    {
      icon: Shield,
      label: "Admin Cabang",
      desc: "Kelola admin",
      href: "/admin-pusat/admins",
      color: "bg-orange-500",
    },
    {
      icon: Users,
      label: "Data Customer",
      desc: "Lihat pelanggan",
      href: "/admin-pusat/customers",
      color: "bg-blue-600",
    },
    {
      icon: BadgeDollarSign,
      label: "Tarif Pengiriman",
      desc: "Atur tarif",
      href: "/admin-pusat/rates",
      color: "bg-green-600",
    },
    {
      icon: Truck,
      label: "Shipments",
      desc: "Pantau pengiriman",
      href: "/admin-pusat/shipments",
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ============ WELCOME BANNER ============ */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500 rounded-full opacity-20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Calendar size={12} />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Selamat Datang, Manager 👋
            </h1>
            <p className="text-white/90 text-sm lg:text-base max-w-lg">
              Pantau operasional seluruh cabang dan kelola sistem ekspedisi dari dashboard ini.
            </p>
          </div>

          <Link
            href="/manager/shipments"
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Truck size={18} />
            <span>Lihat Shipments</span>
          </Link>
        </div>
      </div>

      {/* ============ QUICK ACTIONS ============ */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Aksi Cepat</h2>
            <p className="text-sm text-gray-500">Navigasi cepat ke halaman utama</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 border border-transparent hover:border-red-200 transition-all"
              >
                <div
                  className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <Icon className="text-white" size={22} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Getting Started */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
              <AlertCircle className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Panduan Cepat</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Kelola Cabang</p>
                <p className="text-xs text-gray-600">Tambah cabang baru di berbagai kota</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Assign Admin</p>
                <p className="text-xs text-gray-600">Tugaskan admin untuk setiap cabang</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 w-6 h-6 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Atur Tarif</p>
                <p className="text-xs text-gray-600">Tentukan tarif pengiriman antar kota</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                <Package size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Shipment Baru</p>
                <p className="text-xs text-gray-500">Pantau pengiriman terbaru</p>
              </div>
              <Link
                href="/manager/shipments"
                className="text-red-600 hover:text-red-700"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                <Users size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Customer Baru</p>
                <p className="text-xs text-gray-500">Lihat pelanggan terbaru</p>
              </div>
              <Link
                href="/manager/customers"
                className="text-red-600 hover:text-red-700"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                <Building2 size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Cabang Baru</p>
                <p className="text-xs text-gray-500">Kelola cabang terbaru</p>
              </div>
              <Link
                href="/manager/branches"
                className="text-red-600 hover:text-red-700"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}