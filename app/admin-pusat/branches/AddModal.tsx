"use client";

import { useEffect, useState } from "react";
import {
  X,
  Building2,
  MapPin,
  FileText,
  Phone,
  Save,
  Plus,
  CheckCircle2,
} from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        city: "",
        address: "",
        phone: "",
      });
    }
  }, [open]);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <Plus className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tambah Cabang</h2>
              <p className="text-xs text-gray-500">Buat cabang ekspedisi baru</p>
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
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <Building2 className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-0.5">Informasi Cabang</p>
              <p className="text-xs text-blue-700">
                Cabang akan menjadi pusat operasional untuk mengelola shipments, kurir, dan tracking di wilayah tertentu.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building2 size={16} className="text-red-600" />
              Nama Cabang <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Contoh: Cirebon Hub"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Nama unik untuk mengidentifikasi cabang
            </p>
          </div>

          {/* City */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="text-red-600" />
              Kota <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Contoh: Cirebon"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Kota lokasi cabang beroperasi
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-red-600" />
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                placeholder="Contoh: Jl. Siliwangi No. 123, Cirebon"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <FileText size={16} className="absolute left-4 top-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Alamat lengkap cabang termasuk nomor jalan
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone size={16} className="text-red-600" />
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Contoh: 0231-123456"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Nomor telepon yang dapat dihubungi
            </p>
          </div>

          {/* Preview Card */}
          {form.name && form.city && form.address && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-600" size={16} />
                <p className="text-sm font-semibold text-green-900">Preview Cabang Baru</p>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="text-green-800">
                  <span className="font-semibold">Nama:</span> {form.name}
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">Kota:</span> {form.city}
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">Alamat:</span> {form.address}
                </p>
                {form.phone && (
                  <p className="text-green-800">
                    <span className="font-semibold">Telepon:</span> {form.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan Cabang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

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