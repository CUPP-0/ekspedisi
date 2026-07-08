"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Cabang berhasil ditambahkan");

      setForm({
        name: "",
        city: "",
        address: "",
        phone: "",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-5">
          Tambah Cabang
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            className="border rounded-lg p-3 w-full"
            placeholder="Nama Cabang"
            value={form.name}
            onChange={(e)=>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <input
            className="border rounded-lg p-3 w-full"
            placeholder="Kota"
            value={form.city}
            onChange={(e)=>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            required
          />

          <textarea
            className="border rounded-lg p-3 w-full"
            placeholder="Alamat"
            value={form.address}
            onChange={(e)=>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            required
          />

          <input
            className="border rounded-lg p-3 w-full"
            placeholder="Nomor Telepon"
            value={form.phone}
            onChange={(e)=>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            required
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border"
            >
              Batal
            </button>

            <button
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}