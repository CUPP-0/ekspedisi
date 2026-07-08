'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface Shipment {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin_branch: string;
  destination_branch: string;
  total_weight: number;
  total_price: number;
  payment_status: string;
  status: string;
  created_at: string;
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadShipments();
  }, []);

  async function loadShipments() {
    setLoading(true);

    try {
      const res = await fetch('/api/manager/shipments');

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipments(data);
    } catch (err) {
      console.log(err);
      alert('Gagal mengambil data shipment.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return shipments.filter((item) =>
      item.tracking_number
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [shipments, search]);

  function paymentBadge(status: string) {
    switch (status) {
      case 'paid':
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            Paid
          </span>
        );

      case 'failed':
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
            Failed
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
            Pending
          </span>
        );
    }
  }

  function shipmentBadge(status: string) {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm capitalize">
            Delivered
          </span>
        );

      case 'out_for_delivery':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
            Out For Delivery
          </span>
        );

      case 'in_transit':
        return (
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm capitalize">
            In Transit
          </span>
        );

      case 'picked_up':
        return (
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm capitalize">
            Picked Up
          </span>
        );

      case 'paid':
        return (
          <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm capitalize">
            Paid
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm capitalize">
            {status}
          </span>
        );
    }
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Shipments
          </h1>

          <p className="text-gray-500 mt-2">
            Daftar shipment pada cabang Anda
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b">

          <input
            className="border rounded-lg px-4 py-3 w-full md:w-80"
            placeholder="Cari Tracking Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4">Tracking</th>

                <th className="text-left px-6 py-4">Pengirim</th>

                <th className="text-left px-6 py-4">Penerima</th>

                <th className="text-left px-6 py-4">Cabang</th>

                <th className="text-left px-6 py-4">Berat</th>

                <th className="text-left px-6 py-4">Ongkir</th>

                <th className="text-left px-6 py-4">Pembayaran</th>

                <th className="text-left px-6 py-4">Status</th>

                <th className="text-center px-6 py-4">Aksi</th>

              </tr>

            </thead>

            <tbody>

              {loading && (

                <tr>

                  <td
                    colSpan={9}
                    className="text-center py-10"
                  >
                    Loading...
                  </td>

                </tr>

              )}

              {!loading &&
                filtered.length === 0 && (

                  <tr>

                    <td
                      colSpan={9}
                      className="text-center py-10 text-gray-500"
                    >
                      Tidak ada shipment.
                    </td>

                  </tr>

                )}

              {!loading &&
                filtered.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-semibold">
                      {item.tracking_number}
                    </td>

                    <td className="px-6 py-4">
                      {item.sender_name}
                    </td>

                    <td className="px-6 py-4">
                      {item.receiver_name}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.origin_branch}
                      <br />
                      →
                      <br />
                      {item.destination_branch}
                    </td>

                    <td className="px-6 py-4">
                      {item.total_weight} Kg
                    </td>

                    <td className="px-6 py-4">
                      Rp{' '}
                      {Number(
                        item.total_price
                      ).toLocaleString('id-ID')}
                    </td>

                    <td className="px-6 py-4">
                      {paymentBadge(
                        item.payment_status
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {shipmentBadge(item.status)}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <Link
                        href={`/manager/shipments/${item.id}`}
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

    </div>
  );
}