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

  const [shipment, setShipment] = useState<Shipment | null>(null);

  const [items, setItems] = useState<any[]>([]);

  const [trackings, setTrackings] = useState<any[]>([]);

  const [couriers, setCouriers] = useState<any[]>([]);

  const [courierId, setCourierId] = useState('');
  const [showCourier, setShowCourier] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);

  const [editingTracking, setEditingTracking] = useState<any>(null);

  const [trackingForm, setTrackingForm] = useState({
    status: '',
    location: '',
    description: '',
  });

  function openAddTracking() {
    setEditingTracking(null);

    setTrackingForm({
      status: '',
      location: '',
      description: '',
    });

    setOpenTracking(true);
  }

  function openEditTracking(tracking: any) {
    setEditingTracking(tracking);

    setTrackingForm({
      status: tracking.status,
      location: tracking.location,
      description: tracking.description || '',
    });

    setOpenTracking(true);
  }

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    setLoading(true);

    const res = await fetch(`/api/admin/shipments/${id}`);

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setShipment(data.shipment);

    setItems(data.items);

    setTrackings(data.trackings);

    setCouriers(data.couriers);

    if (data.shipment.courier_id) {
      setCourierId(String(data.shipment.courier_id));
    }

    setLoading(false);
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!shipment) {
    return null;
  }

  async function assignCourier() {
    if (!courierId) {
      alert('Pilih kurir.');
      return;
    }

    const res = await fetch('/api/admin/shipments/assign', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        shipment_id: id,

        courier_id: courierId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);

      return;
    }

    alert('Kurir berhasil ditugaskan.');

    loadShipment();
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

    setOpenTracking(false);

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

              <button onClick={() => setShowCourier(true)} className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg">
                Ganti Kurir
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-500">Belum ada kurir.</p>

              <button
                onClick={() => setShowCourier(true)}
                disabled={shipment.payment_status !== 'paid'}
                className={`mt-5 px-5 py-2 rounded-lg text-white transition ${shipment.payment_status === 'paid' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {shipment.payment_status === 'paid' ? 'Assign Kurir' : 'Menunggu Pembayaran'}
              </button>
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

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Assign Kurir</h2>

        <select className="border rounded-lg p-3 w-full" value={courierId} onChange={(e) => setCourierId(e.target.value)}>
          <option value="">Pilih Kurir</option>

          {couriers.map((courier) => (
            <option key={courier.id} value={courier.id}>
              {courier.name}
            </option>
          ))}
        </select>

        <button
          onClick={assignCourier}
          disabled={shipment.payment_status !== 'paid'}
          className={`mt-5 px-6 py-3 rounded-lg text-white ${shipment.payment_status === 'paid' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {shipment.payment_status === 'paid' ? 'Assign Kurir' : 'Menunggu Pembayaran'}
        </button>
      </div>
      <h2 className="text-xl font-bold mb-5">{editingTracking ? 'Edit Tracking' : 'Tambah Tracking'}</h2>
      <button onClick={openAddTracking} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
        Tambah Tracking
      </button>
      {openTracking && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-5">{editingTracking ? 'Edit Tracking' : 'Tambah Tracking'}</h2>

            <select
              className="border rounded-lg p-3 w-full mb-4"
              value={trackingForm.status}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
                  status: e.target.value,
                })
              }
            >
              <option value="">Pilih Status</option>

              <option value="assigned">Assigned</option>

              <option value="picked_up">Picked Up</option>

              <option value="in_transit">In Transit</option>

              <option value="arrived_at_branch">Arrived At Branch</option>

              <option value="out_for_delivery">Out For Delivery</option>

              <option value="delivered">Delivered</option>
            </select>

            <input
              type="text"
              className="border rounded-lg p-3 w-full mb-4"
              placeholder="Lokasi"
              value={trackingForm.location}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
                  location: e.target.value,
                })
              }
            />

            <textarea
              rows={4}
              className="border rounded-lg p-3 w-full resize-none"
              placeholder="Keterangan"
              value={trackingForm.description}
              onChange={(e) =>
                setTrackingForm({
                  ...trackingForm,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setOpenTracking(false);

                  setEditingTracking(null);

                  setTrackingForm({
                    status: '',
                    location: '',
                    description: '',
                  });
                }}
                className="px-5 py-2 rounded-lg border hover:bg-gray-100"
              >
                Batal
              </button>

              <button type="button" onClick={saveTracking} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                {editingTracking ? 'Update Tracking' : 'Simpan Tracking'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCourier && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold">Pilih Kurir</h2>

            <select className="border rounded-lg p-3 w-full mt-5" value={courierId} onChange={(e) => setCourierId(e.target.value)}>
              <option value="">Pilih Kurir</option>

              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCourier(false)} className="border px-5 py-2 rounded-lg">
                Batal
              </button>

              <button onClick={assignCourier} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
