"use client";

import { useEffect, useState } from "react";

export default function AdminTrackingPage() {
  const [trackings, setTrackings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, []);

  async function loadTracking() {
    try {
      const res = await fetch("/api/admin/tracking");
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setTrackings(data);
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
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Tracking Shipment
        </h1>

        <p className="text-gray-500">
          Riwayat seluruh tracking paket di cabang
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Tracking
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Lokasi
              </th>

              <th className="text-left p-4">
                Kurir
              </th>

              <th className="text-left p-4">
                Waktu
              </th>

            </tr>

          </thead>

          <tbody>

            {trackings.length === 0 && (
              <tr>

                <td
                  colSpan={5}
                  className="text-center py-10"
                >
                  Belum ada tracking.
                </td>

              </tr>
            )}

            {trackings.map((tracking) => (

              <tr
                key={tracking.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">
                  {tracking.tracking_number}
                </td>

                <td className="p-4 capitalize">
                  {tracking.status.replaceAll("_", " ")}
                </td>

                <td className="p-4">
                  {tracking.location}
                </td>

                <td className="p-4">
                  {tracking.courier_name ?? "-"}
                </td>

                <td className="p-4">
                  {new Date(
                    tracking.tracked_at
                  ).toLocaleString("id-ID")}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}