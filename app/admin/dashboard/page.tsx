"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/admin/dashboard");

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setDashboard(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Admin
        </h1>

        <p className="text-gray-500">
          Ringkasan operasional cabang
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <Card
          title="Total Shipment"
          value={dashboard.totalShipment}
          color="blue"
        />

        <Card
          title="Pending Payment"
          value={dashboard.pendingPayment}
          color="yellow"
        />

        <Card
          title="Assigned"
          value={dashboard.assigned}
          color="purple"
        />

        <Card
          title="Delivered"
          value={dashboard.delivered}
          color="green"
        />

        <Card
          title="Total Kurir"
          value={dashboard.totalCourier}
          color="indigo"
        />

        <Card
          title="Shipment Hari Ini"
          value={dashboard.todayShipment}
          color="red"
        />

      </div>

      {/* Shipment Terbaru */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b flex justify-between items-center">

          <h2 className="font-bold text-lg">
            Shipment Terbaru
          </h2>

          <Link
            href="/admin/shipments"
            className="text-blue-600 hover:underline"
          >
            Lihat Semua
          </Link>

        </div>

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-4">
                Tracking
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Ongkir
              </th>

              <th className="text-left p-4">
                Tanggal
              </th>

            </tr>

          </thead>

          <tbody>

            {dashboard.latest.map((shipment: any) => (

              <tr
                key={shipment.tracking_number}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {shipment.tracking_number}
                </td>

                <td className="p-4 capitalize">
                  {shipment.status.replaceAll("_", " ")}
                </td>

                <td className="p-4">
                  Rp{" "}
                  {Number(shipment.total_price).toLocaleString("id-ID")}
                </td>

                <td className="p-4">
                  {new Date(shipment.created_at).toLocaleDateString(
                    "id-ID"
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
    purple: "border-purple-500",
    indigo: "border-indigo-500",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow p-6 border-l-4 ${colors[color]}`}
    >
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}