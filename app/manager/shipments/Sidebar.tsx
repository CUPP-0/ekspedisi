"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  FileText,
  Receipt,
  LogOut,
  ChevronRight,
  Package,
  HelpCircle,
  Shield,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Shipments",
    href: "/manager/shipments",
    icon: Truck,
  },
  {
    title: "Report Shipment",
    href: "/manager/report-shipment",
    icon: FileText,
  },
  {
    title: "Report Payment",
    href: "/manager/report-payment",
    icon: Receipt,
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/manager/dashboard" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-red-200">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 leading-tight">
                BAZMA <span className="text-red-600">Express</span>
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight">Manager Panel</p>
            </div>
          </Link>
        </div>

        {/* Manager Badge */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1.5 rounded-lg">
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Head Office</p>
              <p className="text-[10px] text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Menu Utama
          </p>
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{menu.title}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}

          {/* Quick Actions */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Bantuan
            </p>
            <Link
              href="/manager/help"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <HelpCircle size={20} />
              <span className="text-sm">Pusat Bantuan</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              if (confirm("Yakin ingin logout?")) {
                window.location.href = "/login/internal";
              }
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}