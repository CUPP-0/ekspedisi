"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  Building2,
  MapPin,
} from "lucide-react";

interface Branch {
  id: number;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
}

interface Props {
  open: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({
  open,
  branch,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !branch) return null;

  async function handleDelete() {

  if (!branch) return;

  try {

    const res = await fetch(`/api/branches/${branch.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Cabang berhasil dihapus");

    onSuccess();
    onClose();

  } catch (err) {

    console.log(err);
    alert("Terjadi kesalahan");

  }finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg">
              <Trash2 className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Hapus Cabang</h2>
              <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
              <AlertTriangle className="text-red-600" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900 mb-0.5">Peringatan</p>
              <p className="text-xs text-red-700">
                Menghapus cabang akan menghapus semua data terkait termasuk admin, shipments, dan tarif yang terhubung dengan cabang ini.
              </p>
            </div>
          </div>

          {/* Branch Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Cabang yang akan dihapus:</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{branch.name}</p>
                {branch.city && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {branch.city}
                  </p>
                )}
                <p className="text-xs text-gray-500">ID: #{branch.id}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menghapus cabang <b className="text-gray-900">{branch.name}</b>?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Ya, Hapus Cabang</span>
                </>
              )}
            </button>
          </div>
        </div>
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