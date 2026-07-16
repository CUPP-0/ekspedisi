"use client";

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Home,
  DollarSign,
  Clock,
  Save,
  Edit3,
  Building2,
  Route,
  Loader2,
  AlertCircle,
} from "lucide-react";

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

export default function EditModal({ open, onClose, refresh, rate }: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    const origin = branches.find((b) => b.city === rate.origin_city);
    const destination = branches.find((b) => b.city === rate.destination_city);

    setForm({
      origin_branch_id: origin ? String(origin.id) : "",
      destination_branch_id: destination ? String(destination.id) : "",
      price_per_kg: String(rate.price_per_kg),
      estimated_days: String(rate.estimated_days),
    });
  }, [branches, rate, open]);

  async function getBranches() {
    setLoadingBranches(true);
    try {
      const res = await fetch("/api/branches/list");
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBranches(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/rates/${rate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <Edit3 className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Tarif</h2>
              <p className="text-xs text-gray-500">Perbarui informasi tarif pengiriman</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Current Rate Info */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <Route className="text-red-600" size={16} />
            </div>
            <div className="flex-1 text-sm">
              <span className="font-semibold text-gray-900">
                {rate.origin_city}
              </span>
              <span className="text-gray-400 mx-2">→</span>
              <span className="font-semibold text-gray-900">
                {rate.destination_city}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Origin Branch */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="text-red-600" />
              Cabang Asal <span className="text-red-500">*</span>
            </label>
            {loadingBranches ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Loader2 className="animate-spin text-gray-400" size={16} />
                <span className="text-sm text-gray-500">Memuat daftar cabang...</span>
              </div>
            ) : (
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                value={form.origin_branch_id}
                onChange={(e) => setForm({ ...form, origin_branch_id: e.target.value })}
                required
              >
                <option value="">Pilih Cabang Asal</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Destination Branch */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Home size={16} className="text-red-600" />
              Cabang Tujuan <span className="text-red-500">*</span>
            </label>
            {loadingBranches ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Loader2 className="animate-spin text-gray-400" size={16} />
                <span className="text-sm text-gray-500">Memuat daftar cabang...</span>
              </div>
            ) : (
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                value={form.destination_branch_id}
                onChange={(e) => setForm({ ...form, destination_branch_id: e.target.value })}
                required
              >
                <option value="">Pilih Cabang Tujuan</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price & Days Grid */}
          <div className="grid grid-cols-2 gap-4">
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  placeholder="0"
                  value={form.price_per_kg}
                  onChange={(e) => setForm({ ...form, price_per_kg: e.target.value })}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                  Rp/Kg
                </span>
              </div>
            </div>

            {/* Estimated Days */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="text-red-600" />
                Estimasi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  placeholder="1"
                  value={form.estimated_days}
                  onChange={(e) => setForm({ ...form, estimated_days: e.target.value })}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                  Hari
                </span>
              </div>
            </div>
          </div>

          {/* Warning Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-yellow-800">
              Perubahan tarif akan berlaku untuk pengiriman baru. Tarif lama untuk shipment yang sudah berjalan tidak akan terpengaruh.
            </p>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting || loadingBranches}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Update Tarif</span>
              </>
            )}
          </button>
        </div>
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