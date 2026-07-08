'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const nextLabel: Record<string, string> = {
  assigned: 'Picked Up',
  picked_up: 'In Transit',
  in_transit: 'Arrived At Branch',
  arrived_at_branch: 'Out For Delivery',
  out_for_delivery: 'Delivered',
};

export default function CourierShipmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shipment, setShipment] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [trackings, setTrackings] = useState<any[]>([]);

  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    try {
      setLoading(true);

      const res = await fetch(`/api/courier/shipments/${id}`);

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        router.push('/courier/shipments');
        return;
      }

      setShipment(data.shipment);
      console.log("Status shipment:", data.shipment.status);
      setItems(data.items || []);
      setTrackings(data.trackings || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function nextProcess() {
    if (!location.trim()) {
      alert('Lokasi wajib diisi.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/courier/tracking', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          shipment_id: shipment.id,
          location,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      setLocation('');
      setDescription('');

      await loadShipment();
    } catch (err) {
      console.log(err);

      alert('Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!shipment) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Shipment */}

      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">{shipment.tracking_number}</h1>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-3">Pengirim</h2>

            <p>{shipment.sender_name}</p>
            <p>{shipment.sender_phone}</p>
            <p>{shipment.sender_address}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Penerima</h2>

            <p>{shipment.receiver_name}</p>
            <p>{shipment.receiver_phone}</p>
            <p>{shipment.receiver_address}</p>
          </div>
        </div>

        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p>
              <strong>Cabang Asal :</strong> {shipment.origin_branch}
            </p>

            <p>
              <strong>Cabang Tujuan :</strong> {shipment.destination_branch}
            </p>

            <p>
              <strong>Status :</strong> <span className="capitalize font-semibold">{shipment.status.replaceAll('_', ' ')}</span>
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <strong>Pembayaran :</strong> {shipment.payment_status}
            </p>

            <p>
              <strong>Total Berat :</strong> {shipment.total_weight} Kg
            </p>

            <p>
              <strong>Total Ongkir :</strong> Rp {Number(shipment.total_price).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Barang */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-5">Daftar Barang</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Nama Barang</th>

              <th className="text-left">Qty</th>

              <th className="text-left">Berat</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  Tidak ada barang.
                </td>
              </tr>
            )}

            {items.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.item_name}</td>

                <td>{item.quantity}</td>

                <td>{item.weight} Kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline Tracking */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-5">Riwayat Tracking</h2>

        <div className="space-y-5">
          {trackings.length === 0 && <p className="text-gray-500">Belum ada tracking.</p>}

          {trackings.map((tracking: any) => (
            <div key={tracking.id} className="border-l-4 border-blue-600 pl-5">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold capitalize">{tracking.status.replaceAll('_', ' ')}</h3>

                <span className="text-xs text-gray-400">{new Date(tracking.tracked_at).toLocaleString('id-ID')}</span>
              </div>

              <p className="mt-1 text-gray-600">📍 {tracking.location}</p>

              {tracking.description && <p className="mt-2 text-gray-500">{tracking.description}</p>}
            </div>
          ))}
        </div>
      </div>
      {/* Update Tracking */}

      {nextLabel[shipment.status] ? (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Update Status Pengiriman</h2>

          <p className="text-gray-500 mb-5">Lengkapi lokasi dan keterangan. Status berikutnya akan dipilih otomatis oleh sistem.</p>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Lokasi Saat Ini</label>

              <input className="border rounded-lg w-full p-3" placeholder="Contoh: Jl. Raya Bogor KM 25" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div>
              <label className="block mb-2 font-medium">Keterangan</label>

              <textarea rows={4} className="border rounded-lg w-full p-3" placeholder="Contoh: Kurir sedang menuju alamat penerima..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <button onClick={nextProcess} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition">
              {saving ? 'Memproses...' : `Update ke ${nextLabel[shipment.status]}`}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-300 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-green-700">✅ Pengiriman Selesai</h2>

          <p className="mt-2 text-green-600">Paket telah berhasil diterima oleh penerima. Tidak ada update tracking lagi yang dapat dilakukan.</p>
        </div>
      )}
    </div>
  );
}
