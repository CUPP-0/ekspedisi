"use client";

import { useEffect, useState } from "react";

interface Branch {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
}

interface Props {
  open: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({
  open,
  branch,
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

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name,
        city: branch.city,
        address: branch.address,
        phone: branch.phone,
      });
    }
  }, [branch]);

  if (!open || !branch) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`/api/branches/${branch.id}`, {
        method: "PUT",
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

      alert("Cabang berhasil diupdate");

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
          Edit Cabang
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="border rounded-lg p-3 w-full"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
            className="border rounded-lg p-3 w-full"
            value={form.city}
            onChange={(e)=>setForm({...form,city:e.target.value})}
          />

          <textarea
            className="border rounded-lg p-3 w-full"
            value={form.address}
            onChange={(e)=>setForm({...form,address:e.target.value})}
          />

          <input
            className="border rounded-lg p-3 w-full"
            value={form.phone}
            onChange={(e)=>setForm({...form,phone:e.target.value})}
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
            >
              Batal
            </button>

            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Update"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}