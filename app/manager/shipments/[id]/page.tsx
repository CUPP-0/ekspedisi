'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Shipment {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;

  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;

  origin_branch: string;
  destination_branch: string;

  total_weight: number;
  total_price: number;

  payment_status: string;
  status: string;

  courier_id: number | null;
  courier_name: string | null;

  courier_phone: string | null;
}

export default function DetailShipmentPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [shipment, setShipment] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);

  const [trackings, setTrackings] = useState<any[]>([]);

  const [editingTracking, setEditingTracking] = useState<any>(null);

  const [trackingForm, setTrackingForm] = useState({
    status: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    setLoading(true);

    const res = await fetch(`/api/manager/shipments/${id}`);

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setShipment(data.shipment);

    setItems(data.items);

    setTrackings(data.trackings);

    setLoading(false);
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!shipment) {
    return null;
  }

  async function saveTracking() {
    let url = '/api/admin/shipments/tracking';

    let method = 'POST';

    if (editingTracking) {
      url = `/api/admin/shipments/tracking/${editingTracking.id}`;

      method = 'PUT';
    }

    const res = await fetch(url, {
      method,

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        shipment_id: id,

        ...trackingForm,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);

      return;
    }

    alert(editingTracking ? 'Tracking berhasil diperbarui.' : 'Tracking berhasil ditambahkan.');



    setEditingTracking(null);

    setTrackingForm({
      status: '',
      location: '',
      description: '',
    });

    loadShipment();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">{shipment.tracking_number}</h1>

        <p className="mt-3 text-gray-500">
          Status :<span className="font-semibold ml-2">{shipment.status}</span>
        </p>

        <p className="mt-2">
          Pembayaran :<span className="font-semibold ml-2">{shipment.payment_status}</span>
        </p>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Kurir</h2>

          {shipment.courier_name ? (
            <div>
              <p>
                <strong>Nama :</strong>

                {shipment.courier_name}
              </p>

              <p className="mt-2">
                <strong>No HP :</strong>

                {shipment.courier_phone}
              </p>

            </div>
          ) : (
            <div>
              <p className="text-gray-500">Belum ada kurir.</p>

            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Pengirim</h2>

          <p>
            <strong>Nama :</strong>

            {shipment.sender_name}
          </p>

          <p>
            <strong>HP :</strong>

            {shipment.sender_phone}
          </p>

          <p>
            <strong>Alamat :</strong>

            {shipment.sender_address}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Penerima</h2>

          <p>
            <strong>Nama :</strong>

            {shipment.receiver_name}
          </p>

          <p>
            <strong>HP :</strong>

            {shipment.receiver_phone}
          </p>

          <p>
            <strong>Alamat :</strong>

            {shipment.receiver_address}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Barang</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Barang</th>

              <th className="text-left">Qty</th>

              <th className="text-left">Berat</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.item_name}</td>

                <td>{item.quantity}</td>

                <td>{item.weight} Kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Tracking</h2>

        <div className="space-y-4">
          {trackings.length === 0 && <p>Belum ada tracking.</p>}

          {trackings.map((tracking) => (
            <div key={tracking.id} className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold">{tracking.status}</h3>

              <p>{tracking.location}</p>

              <p className="text-sm text-gray-500">{tracking.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
