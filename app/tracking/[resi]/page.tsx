"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  Truck,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function TrackingPage() {
  const { resi } = useParams();

  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [trackings, setTrackings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any>(null);

  useEffect(() => {
    loadTracking();
  }, []);

  async function loadTracking() {
    try {
      const res = await fetch(`/api/tracking/${resi}`);

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      console.log(data);
      setShipment(data.shipment);
      setItems(data.items || []);
      setTrackings(data.trackings || []);
      
      setPayments(data.payments || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function statusColor(payment_status: string) {
    switch (payment_status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "paid":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function statusLabel(payment_status: string) {
    switch (payment_status) {
      case "pending":
        return "Menunggu Pembayaran";

      case "paid":
        return "Sudah dibayar";

      default:
        return payment_status;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Resi tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-10">

      <div className="max-w-6xl mx-auto px-5 space-y-6">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                <Package
                  size={40}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-gray-500">
                  Nomor Resi
                </p>

                <h1 className="text-3xl font-bold">
                  {shipment.tracking_number}
                </h1>

                <div
                  className={`inline-block mt-4 px-4 py-2 rounded-full font-semibold ${statusColor(
                    payments?.[0]?.payment_status
                  )}`}
                >
                  {statusLabel(payments?.[0]?.payment_status)}
                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              <div>

                <p className="text-gray-500">
                  Berat
                </p>

                <div className="font-bold text-xl">
                  {shipment.total_weight} Kg
                </div>

              </div>

              <div>

                <p className="text-gray-500">
                  Ongkir
                </p>

                <div className="font-bold text-xl">
                  Rp{" "}
                  {Number(shipment.total_price).toLocaleString("id-ID")}
                </div>

              </div>

              <div>

                <p className="text-gray-500">
                  Cabang Asal
                </p>

                <div className="font-semibold">
                  {shipment.origin_branch}
                </div>

              </div>

              <div>

                <p className="text-gray-500">
                  Cabang Tujuan
                </p>

                <div className="font-semibold">
                  {shipment.destination_branch}
                </div>

              </div>

            </div>

          </div>

        </div>
                {/* Timeline Tracking */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-8">

            <Clock className="text-blue-600" />

            <h2 className="text-2xl font-bold">
              Riwayat Tracking
            </h2>

          </div>

          {trackings.length === 0 ? (

            <div className="text-center text-gray-500 py-10">

              Belum ada riwayat tracking.

            </div>

          ) : (

            <div className="space-y-8">

              {trackings.map((tracking: any, index: number) => (

                <div
                  key={tracking.id}
                  className="flex gap-5"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-5 h-5 rounded-full ${
                        index === 0
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    />

                    {index !== trackings.length - 1 && (
                      <div className="w-1 flex-1 bg-gray-300 mt-2" />
                    )}

                  </div>

                  <div className="pb-5">

                    <div className="font-bold text-lg capitalize">

                      {tracking.status.replaceAll("_", " ")}

                    </div>

                    <div className="text-blue-600 mt-1">

                      {tracking.location}

                    </div>

                    <div className="text-gray-600 mt-2">

                      {tracking.description}

                    </div>

                    <div className="text-sm text-gray-400 mt-2">

                      {new Date(tracking.tracked_at).toLocaleString("id-ID")}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>



        {/* Pengirim & Penerima */}

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-5">

              <User className="text-blue-600"/>

              <h2 className="text-xl font-bold">

                Pengirim

              </h2>

            </div>

            <div className="space-y-3">

              <p>

                <strong>Nama :</strong>

                {" "}

                {shipment.sender_name}

              </p>

              <p>

                <strong>Telepon :</strong>

                {" "}

                {shipment.sender_phone}

              </p>

              <p>

                <strong>Alamat :</strong>

                {" "}

                {shipment.sender_address}

              </p>

            </div>

          </div>



          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-5">

              <MapPin className="text-red-500"/>

              <h2 className="text-xl font-bold">

                Penerima

              </h2>

            </div>

            <div className="space-y-3">

              <p>

                <strong>Nama :</strong>

                {" "}

                {shipment.receiver_name}

              </p>

              <p>

                <strong>Telepon :</strong>

                {" "}

                {shipment.receiver_phone}

              </p>

              <p>

                <strong>Alamat :</strong>

                {" "}

                {shipment.receiver_address}

              </p>

            </div>

          </div>

        </div>
                {/* Daftar Barang */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-6">

            <Package className="text-blue-600" />

            <h2 className="text-2xl font-bold">
              Daftar Barang
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-50">

                  <th className="text-left py-3 px-4">Nama Barang</th>

                  <th className="text-center py-3 px-4">Qty</th>

                  <th className="text-center py-3 px-4">Berat</th>

                </tr>

              </thead>

              <tbody>

                {items.length === 0 ? (

                  <tr>

                    <td
                      colSpan={3}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada data barang.
                    </td>

                  </tr>

                ) : (

                  items.map((item: any) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="py-4 px-4">
                        {item.item_name}
                      </td>

                      <td className="text-center">
                        {item.quantity}
                      </td>

                      <td className="text-center">
                        {item.weight} Kg
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>



        {/* Ringkasan */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-6">

            <Truck className="text-blue-600" />

            <h2 className="text-2xl font-bold">
              Informasi Pengiriman
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <p className="text-gray-500">
                Cabang Asal
              </p>

              <div className="font-semibold">
                {shipment.origin_branch}
              </div>

            </div>

            <div>

              <p className="text-gray-500">
                Cabang Tujuan
              </p>

              <div className="font-semibold">
                {shipment.destination_branch}
              </div>

            </div>

            <div>

              <p className="text-gray-500">
                Berat Total
              </p>

              <div className="font-semibold">
                {shipment.total_weight} Kg
              </div>

            </div>

            <div>

              <p className="text-gray-500">
                Total Ongkir
              </p>

              <div className="font-semibold">
                Rp {Number(shipment.total_price).toLocaleString("id-ID")}
              </div>

            </div>

            <div>

              <p className="text-gray-500">
                Status Pembayaran
              </p>

              <div className="font-semibold capitalize">
                {shipment.payment_status}
              </div>

            </div>

            <div>

              <p className="text-gray-500">
                Status Pengiriman
              </p>

              <div className="font-semibold capitalize">
                {shipment.status.replaceAll("_", " ")}
              </div>

            </div>

          </div>

        </div>



        <div className="text-center py-8">

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
          >

            <ArrowLeft size={18} />

            Kembali ke Beranda

          </Link>

        </div>

      </div>

    </div>

  );

}