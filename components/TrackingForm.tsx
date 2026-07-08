"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TrackingForm() {

  const router = useRouter();

  const [tracking, setTracking] = useState("");

  function submit() {

    if (!tracking) {
      return;
    }

    router.push(`/tracking/${tracking}`);

  }

  return (
    <section
      id="tracking"
      className="-mt-12 relative z-10"
    >

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-3">
          Lacak Pengiriman
        </h2>

        <p className="text-gray-500 mb-6">
          Masukkan nomor resi untuk mengetahui posisi paket Anda.
        </p>

        <div className="flex gap-4">

          <input
            className="flex-1 border rounded-xl p-4"
            placeholder="Contoh : EXP000001"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
          />

          <button
            onClick={submit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl"
          >
            Lacak
          </button>

        </div>

      </div>

    </section>
  );
}