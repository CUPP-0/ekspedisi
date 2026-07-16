"use client";

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Home,
  DollarSign,
  Clock,
  Save,
  Plus,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Branch {
  id: number;
  name: string;
  city: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

export default function AddModal({
  open,
  onClose,
  refresh,
}: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    origin_branch_id: "",
    destination_branch_id: "",
    price_per_kg: "",
    estimated_days: "",
  });

  // Fetch branches saat modal dibuka
  useEffect(() => {
    if (open) {
      getBranches();
    }
  }, [open]);

  // Reset form setiap kali modal dibuka agar bersih
  useEffect(() => {
    if (open) {
      setForm({
        origin_branch_id: "",
        destination_branch_id: "",
        price_per_kg: "",
        estimated_days: "",
      });
    }
  }, [open]);

  async function getBranches() {
    try {
      const res = await fetch("/api/branches/list");
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data cabang", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/rates", {
        method: "POST",
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
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  // Get selected branches for preview
  const originBranch = branches.find((b) => b.id === Number(form.origin_branch_id));
  const destinationBranch = branches.find((b) => b.id === Number(form.destination_branch_id));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <Plus className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tambah Tarif</h2>
              <p className="text-xs text-gray-500">Tambahkan rute dan tarif pengiriman baru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Route Preview */}
          {originBranch && destinationBranch && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-500 mb-1">Dari</p>
                  <p className="font-bold text-gray-900 text-sm">{originBranch.city}</p>
                  <p className="text-xs text-gray-500">{originBranch.name}</p>
                </div>
                <div className="flex items-center gap-1 text-red-500 px-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                  <div className="w-6 h-px bg-red-300" />
                  <ChevronRight size={14} />
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-500 mb-1">Ke</p>
                  <p className="font-bold text-gray-900 text-sm">{destinationBranch.city}</p>
                  <p className="text-xs text-gray-500">{destinationBranch.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Origin Branch */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="text-red-600" />
              Cabang Asal <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              value={form.origin_branch_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  origin_branch_id: e.target.value,
                })
              }
              required
            >
              <option value="">Pilih Cabang Asal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.city})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Branch */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Home size={16} className="text-red-600" />
              Cabang Tujuan <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              value={form.destination_branch_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  destination_branch_id: e.target.value,
                })
              }
              required
            >
              <option value="">Pilih Cabang Tujuan</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.city})
                </option>
              ))}
            </select>
          </div>

          {/* Price per Kg */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign size={16} className="text-red-600" />
              Harga per Kg <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Contoh: 15000"
                value={form.price_per_kg}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price_per_kg: e.target.value,
                  })
                }
                required
              />
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Masukkan harga dalam Rupiah (tanpa titik/koma)
            </p>
          </div>

          {/* Estimated Days */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock size={16} className="text-red-600" />
              Estimasi Pengiriman <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-16 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Contoh: 3"
                value={form.estimated_days}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estimated_days: e.target.value,
                  })
                }
                required
              />
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                Hari
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Estimasi waktu pengiriman dalam hari kerja
            </p>
          </div>

          {/* Warning if same origin and destination */}
          {form.origin_branch_id && form.destination_branch_id && form.origin_branch_id === form.destination_branch_id && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-yellow-800">
                Cabang asal dan tujuan tidak boleh sama.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || (form.origin_branch_id === form.destination_branch_id)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan Tarif</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}