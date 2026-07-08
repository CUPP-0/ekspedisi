 'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shipmentId = searchParams.get('shipment_id');

  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!shipmentId) return;

    async function updatePayment() {
      try {
        const res = await fetch('/api/payments/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shipment_id: shipmentId,
          }),
        });

        if (res.ok) {
          setUpdated(true);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    updatePayment();
  }, [shipmentId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">

        <div className="text-6xl mb-4">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-green-600">
          Pembayaran Berhasil
        </h1>

        <p className="text-gray-600 mt-4">
          Terima kasih.
          Pembayaran pengiriman Anda telah berhasil diproses.
        </p>

        <div className="mt-8 bg-gray-50 rounded-xl p-4 text-left">
          <p>
            <strong>Shipment ID :</strong> {shipmentId}
          </p>

          <p className="mt-2">
            <strong>Status Update :</strong>{' '}
            {loading
              ? 'Memperbarui pembayaran...'
              : updated
              ? 'Berhasil'
              : 'Gagal memperbarui'}
          </p>
        </div>

        <button
          disabled={loading}
          onClick={() =>
            router.push(`/customer/shipments/${shipmentId}`)
          }
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-400"
        >
          Lihat Detail Paket
        </button>
      </div>
    </div>
  );
}