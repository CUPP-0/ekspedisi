"use client";

import { Menu, Bell, Search, User } from "lucide-react";

export default function Navbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          
          <h2 className="md:hidden font-semibold text-lg text-gray-900">
            Manager Panel
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
          </button>

          {/* User Profile Info */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">Manager</p>
              <p className="text-xs text-gray-500 leading-tight">Head Office</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}