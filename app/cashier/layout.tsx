"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  CreditCard,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Package,
  HelpCircle,
  DollarSign,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/cashier",
    icon: LayoutDashboard,
  },
  {
    title: "Pembayaran",
    href: "/cashier/payments",
    icon: CreditCard,
  },
  {
    title: "Profil",
    href: "/cashier/profile",
    icon: User,
  },
];

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    if (confirm("Yakin ingin logout?")) {
      router.push("/login/internal");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Toggle Button - Only visible on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <Link href="/cashier" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-red-200">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 leading-tight">
                  BAZMA <span className="text-red-600">Express</span>
                </h1>
                <p className="text-[10px] text-gray-500 leading-tight">Cashier Panel</p>
              </div>
            </Link>
          </div>

          {/* Cashier Badge */}
          <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-1.5 rounded-lg">
                <DollarSign size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Cashier Panel</p>
                <p className="text-[10px] text-gray-500">Payment Management</p>
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
              const isActive =
                pathname === menu.href ||
                (menu.href === "/cashier" && pathname === "/cashier");

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

          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============ CONTENT ============ */}
      <main className="flex-1 p-6 lg:p-8 min-w-0">{children}</main>
    </div>
  );
}