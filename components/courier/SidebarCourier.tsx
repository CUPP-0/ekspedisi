"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarCourier() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      href: "/courier/dashboard",
    },
    {
      name: "Shipment",
      href: "/courier/shipments",
    },
    {
      name: "Profile",
      href: "/courier/profile",
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="font-bold text-2xl">
          Courier Panel
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === menu.href
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {menu.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}