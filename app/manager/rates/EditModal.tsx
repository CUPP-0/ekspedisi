"use client";

import { useEffect, useState } from "react";

interface Branch {
  id: number;
  name: string;
  city: string;
}

interface Rate {
  id: number;
  origin_city: string;
  destination_city: string;
  price_per_kg: number;
  estimated_days: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  rate: Rate;
}

export default function EditModal({
  open,
  onClose,
  refresh,
  rate,
}: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);

  const [form, setForm] = useState({
    origin_branch_id: "",
    destination_branch_id: "",
    price_per_kg: "",
    estimated_days: "",
  });

  useEffect(() => {
    if (open) {
      getBranches();
    }
  }, [open]);

  useEffect(() => {
    if (!open || branches.length === 0) return;

    const origin = branches.find(
      (b) => b.city === rate.origin_city
    );

    const destination = branches.find(
      (b) => b.city === rate.destination_city
    );

    setForm({
      origin_branch_id: origin ? String(origin.id) : "",
      destination_branch_id: destination ? String(destination.id) : "",
      price_per_kg: String(rate.price_per_kg),
      estimated_days: String(rate.estimated_days),
    });
  }, [branches, rate, open]);

  async function getBranches() {
    const res = await fetch("/api/branches/list");
    const data = await res.json();

    setBranches(Array.isArray(data) ? data : []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/rates/${rate.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert(data.message);

    if (!res.ok) return;

    refresh();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Edit Tarif
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="block mb-2 font-medium">
              Cabang Asal
            </label>

            <select
              className="border rounded-lg p-3 w-full"
              value={form.origin_branch_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  origin_branch_id: e.target.value,
                })
              }
              required
            >
              <option value="">
                Pilih Cabang
              </option>

              {branches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name} ({branch.city})
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Cabang Tujuan
            </label>

            <select
              className="border rounded-lg p-3 w-full"
              value={form.destination_branch_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  destination_branch_id: e.target.value,
                })
              }
              required
            >
              <option value="">
                Pilih Cabang
              </option>

              {branches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name} ({branch.city})
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Harga per Kg
            </label>

            <input
              type="number"
              className="border rounded-lg p-3 w-full"
              value={form.price_per_kg}
              onChange={(e) =>
                setForm({
                  ...form,
                  price_per_kg: e.target.value,
                })
              }
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Estimasi (Hari)
            </label>

            <input
              type="number"
              className="border rounded-lg p-3 w-full"
              value={form.estimated_days}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimated_days: e.target.value,
                })
              }
              required
            />

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}