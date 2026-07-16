"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCourierModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  async function saveCourier() {
    const res = await fetch("/api/admin/couriers", {
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

    alert(data.message);

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    onSuccess();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-5">
          Tambah Kurir
        </h2>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Nama"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="No HP"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            type="password"
            className="w-full border rounded-lg p-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <div className="flex justify-end gap-3 pt-2">

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Batal
            </button>

            <button
              onClick={saveCourier}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Simpan
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}