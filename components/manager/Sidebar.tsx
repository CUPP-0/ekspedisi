"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCog,
    Truck,
    BadgeDollarSign,
    Car,
} from "lucide-react";

const menus = [
    {
        title: "Dashboard",
        href: "/manager/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Cabang",
        href: "/manager/branches",
        icon: Building2,
    },
    {
        title: "Admin Cabang",
        href: "/manager/admins",
        icon: UserCog,
    },
    {
        title: "Customer",
        href: "/manager/customers",
        icon: Users,
    },
    {
        title: "Tarif",
        href: "/manager/rates",
        icon: BadgeDollarSign,
    },
    {
        title: "Shipment",
        href: "/manager/shipments",
        icon: Truck,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen">
            <div className="h-16 flex items-center justify-center border-b border-slate-700">
                <h1 className="font-bold text-xl">
                    EKSPEDISI
                </h1>
            </div>

            <div className="mt-5 px-3">

                {menus.map((menu) => {

                    const Icon = menu.icon;

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition
                            ${
                                pathname === menu.href
                                    ? "bg-blue-600"
                                    : "hover:bg-slate-800"
                            }`}
                        >
                            <Icon size={20} />
                            {menu.title}
                        </Link>
                    );
                })}

            </div>
        </aside>
    );
}