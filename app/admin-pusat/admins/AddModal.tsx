"use client";

import { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Lock,
  Building2,
  Save,
  Plus,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Branch {
  id: number;
  name: string;
}

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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch_id: "",
  });

  useEffect(() => {
    if (open) {
      getBranches();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        email: "",
        password: "",
        branch_id: "",
      });
      setShowPassword(false);
    }
  }, [open]);

  async function getBranches() {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data cabang", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admins", {
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

      alert("Admin berhasil ditambahkan");

      setForm({
        name: "",
        email: "",
        password: "",
        branch_id: "",
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

  if (!open) return null;

  const selectedBranch = branches.find((b) => b.id === Number(form.branch_id));

  const passwordStrength = (() => {
    const len = form.password.length;
    if (len === 0) return { label: "", color: "", width: "0%" };
    if (len < 6) return { label: "Lemah", color: "bg-red-500", width: "33%" };
    if (len < 10) return { label: "Sedang", color: "bg-yellow-500", width: "66%" };
    return { label: "Kuat", color: "bg-green-500", width: "100%" };
  })();

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
              <h2 className="text-lg font-bold text-gray-900">Tambah Admin Cabang</h2>
              <p className="text-xs text-gray-500">Buat akun administrator baru untuk cabang</p>
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
              <Shield className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-0.5">Hak Akses Admin</p>
              <p className="text-xs text-blue-700">
                Admin akan memiliki akses penuh untuk mengelola cabang yang dipilih, termasuk shipments, kurir, dan tracking.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={16} className="text-red-600" />
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Contoh: Budi Santoso"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail size={16} className="text-red-600" />
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="admin@bazmaexpress.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email akan digunakan sebagai username untuk login
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="text-red-600" />
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {form.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Kekuatan password:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.label === "Lemah" ? "text-red-600" :
                    passwordStrength.label === "Sedang" ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building2 size={16} className="text-red-600" />
              Cabang <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
              value={form.branch_id}
              onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
              required
            >
              <option value="">-- Pilih Cabang --</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admin hanya dapat mengelola cabang yang dipilih
            </p>
          </div>

          {/* Preview Card */}
          {selectedBranch && form.name && form.email && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-600" size={16} />
                <p className="text-sm font-semibold text-green-900">Preview Admin Baru</p>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="text-green-800">
                  <span className="font-semibold">Nama:</span> {form.name}
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">Email:</span> {form.email}
                </p>
                <p className="text-green-800">
                  <span className="font-semibold">Cabang:</span> {selectedBranch.name}
                </p>
              </div>
            </div>
          )}

          {/* Warning if branches not loaded */}
          {branches.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-yellow-800">
                Data cabang belum dimuat. Silakan tunggu sebentar atau coba refresh halaman.
              </p>
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
              disabled={loading || branches.length === 0}
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
                  <span>Simpan Admin</span>
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