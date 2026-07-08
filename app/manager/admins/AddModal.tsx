"use client";

import { useEffect, useState } from "react";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch_id: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getBranches();
    }
  }, [open]);

  async function getBranches() {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-5">
          Tambah Admin Cabang
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            className="border rounded-lg p-3 w-full"
            placeholder="Nama"
            value={form.name}
            onChange={(e)=>
              setForm({...form,name:e.target.value})
            }
            required
          />

          <input
            type="email"
            className="border rounded-lg p-3 w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e)=>
              setForm({...form,email:e.target.value})
            }
            required
          />

          <input
            type="password"
            className="border rounded-lg p-3 w-full"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>
              setForm({...form,password:e.target.value})
            }
            required
          />

          <select
            className="border rounded-lg p-3 w-full"
            value={form.branch_id}
            onChange={(e)=>
              setForm({...form,branch_id:e.target.value})
            }
            required
          >
            <option value="">
              -- Pilih Cabang --
            </option>

            {branches.map((branch)=>(
              <option
                key={branch.id}
                value={branch.id}
              >
                {branch.name}
              </option>
            ))}

          </select>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
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