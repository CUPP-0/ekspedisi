"use client";

import { useEffect, useState } from "react";
import AddModal from "./AddModal";
import EditModal from "./EditModal";

interface Rate {
  id: number;
  origin_city: string;
  destination_city: string;
  price_per_kg: number;
  estimated_days: number;
}

export default function RatePage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selected, setSelected] = useState<Rate | null>(null);

  async function getRates() {
    setLoading(true);

    try {
      const res = await fetch("/api/rates");
      const data = await res.json();

      setRates(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRates();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Hapus tarif ini?")) return;

    const res = await fetch(`/api/rates/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    alert(data.message);

    getRates();
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Data Tarif
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Tambah Tarif
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Asal</th>
              <th className="p-4 text-left">Tujuan</th>
              <th className="p-4 text-right">Harga / Kg</th>
              <th className="p-4 text-center">Estimasi</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center p-8"
                >
                  Loading...
                </td>
              </tr>

            ) : rates.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center p-8"
                >
                  Belum ada tarif.
                </td>
              </tr>

            ) : (

              rates.map((rate, index) => (

                <tr
                  key={rate.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {index + 1}
                  </td>

                  <td className="p-4">
                    {rate.origin_city}
                  </td>

                  <td className="p-4">
                    {rate.destination_city}
                  </td>

                  <td className="p-4 text-right">
                    Rp{" "}
                    {Number(rate.price_per_kg).toLocaleString("id-ID")}
                  </td>

                  <td className="p-4 text-center">
                    {rate.estimated_days} Hari
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelected(rate);
                          setShowEdit(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(rate.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        refresh={getRates}
      />

      {selected && (

        <EditModal
          open={showEdit}
          rate={selected}
          onClose={() => {
            setShowEdit(false);
            setSelected(null);
          }}
          refresh={getRates}
        />

      )}

    </div>
  );
}