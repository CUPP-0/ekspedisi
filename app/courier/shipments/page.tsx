"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CourierShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    try {
      const res = await fetch("/api/courier/shipments");

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function statusColor(status: string) {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-700";

      case "picked_up":
        return "bg-blue-100 text-blue-700";

      case "in_transit":
        return "bg-indigo-100 text-indigo-700";

      case "arrived_at_branch":
        return "bg-purple-100 text-purple-700";

      case "out_for_delivery":
        return "bg-orange-100 text-orange-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Shipment Saya
        </h1>

        <div className="text-gray-500">
          Total : {shipments.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Tracking
              </th>

              <th className="text-left p-4">
                Pengirim
              </th>

              <th className="text-left p-4">
                Penerima
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Payment
              </th>

              <th className="text-left p-4">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {shipments.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  Tidak ada shipment.
                </td>

              </tr>

            )}

            {shipments.map((shipment) => (

              <tr
                key={shipment.id}
                className="border-t"
              >

                <td className="p-4 font-medium">
                  {shipment.tracking_number}
                </td>

                <td className="p-4">
                  {shipment.sender_name}
                </td>

                <td className="p-4">
                  {shipment.receiver_name}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${statusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status.replaceAll("_", " ")}
                  </span>

                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      shipment.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {shipment.payment_status}
                  </span>

                </td>

                <td className="p-4">

                  <Link
                    href={`/courier/shipments/${shipment.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Detail
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}