"use client";

import { useEffect, useState } from "react";

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    branch_name: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/admin/profile");

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setForm({
        ...data,
        password: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    const res = await fetch("/api/admin/profile", {
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

    alert(data.message);
    loadProfile();
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-6">
          Profile Admin
        </h1>

        <div className="space-y-5">

          <div>
            <label className="block mb-2">
              Nama
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={form.name}
              onChange={(e)=>
                setForm({
                  ...form,
                  name:e.target.value
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Email
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={form.email}
              onChange={(e)=>
                setForm({
                  ...form,
                  email:e.target.value
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Password Baru
            </label>

            <input
              type="password"
              className="border rounded-lg p-3 w-full"
              placeholder="Kosongkan jika tidak ingin diubah"
              value={form.password}
              onChange={(e)=>
                setForm({
                  ...form,
                  password:e.target.value
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2">
              Role
            </label>

            <input
              disabled
              className="border rounded-lg p-3 w-full bg-gray-100"
              value={form.role}
            />
          </div>

          <div>
            <label className="block mb-2">
              Cabang
            </label>

            <input
              disabled
              className="border rounded-lg p-3 w-full bg-gray-100"
              value={form.branch_name}
            />
          </div>

          <button
            onClick={save}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Simpan Perubahan
          </button>

        </div>

      </div>

    </div>
  );
}