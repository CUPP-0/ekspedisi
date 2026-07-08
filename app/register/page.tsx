'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Branch {
  id: number;
  name: string;
  city: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [accountType, setAccountType] = useState<'customer' | 'courier'>('customer');

  const [branches, setBranches] = useState<Branch[]>([]);

  const [form, setForm] = useState({
    branch_id: '',

    name: '',

    email: '',

    password: '',

    confirmPassword: '',

    city: '',

    phone: '',

    address: '',
  });

  useEffect(() => {
    loadBranches();
  }, []);

  async function loadBranches() {
    try {
      const res = await fetch('/api/branches');

      const data = await res.json();

      if (res.ok) {
        setBranches(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Konfirmasi password tidak sama.');
      return;
    }

    if (accountType === 'courier' && !form.branch_id) {
      alert('Pilih cabang.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = accountType === 'customer' ? '/api/customers/register' : '/api/courier/register';

      const body: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      };

      if (accountType === 'customer') {
        body.city = form.city;
      }

      if (accountType === 'courier') {
        body.branch_id = form.branch_id;
      }

      const res = await fetch(endpoint, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message ?? 'Registrasi berhasil.');

      router.push('/login');
    } catch (err) {
      console.log(err);

      alert('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-5">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Register</h1>

        <p className="text-center text-gray-500 mb-8">Buat akun customer atau daftar sebagai kurir.</p>

        <div className="flex gap-6 justify-center mb-8">
          <label className="flex items-center gap-2">
            <input type="radio" checked={accountType === 'customer'} onChange={() => setAccountType('customer')} />
            Customer
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" checked={accountType === 'courier'} onChange={() => setAccountType('courier')} />
            Kurir
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {accountType === 'courier' && (
            <select
              className="w-full border rounded-lg p-3"
              value={form.branch_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  branch_id: e.target.value,
                })
              }
              required
            >
              <option value="">Pilih Cabang</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
          )}

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Nama"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <input
            type="email"
            className="w-full border rounded-lg p-3"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            required
          />

          <input
            type="password"
            className="w-full border rounded-lg p-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            required
          />

          <input
            type="password"
            className="w-full border rounded-lg p-3"
            placeholder="Konfirmasi Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
            required
          />

          {accountType === 'customer' && (
            <input
              className="w-full border rounded-lg p-3"
              placeholder="Kota"
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />
          )}

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Nomor HP"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            required
          />

          <textarea
            className="w-full border rounded-lg p-3"
            rows={4}
            placeholder="Alamat"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-400">
            {loading ? 'Mendaftar...' : accountType === 'customer' ? 'Daftar Customer' : 'Daftar Sebagai Kurir'}
          </button>
        </form>

        <div className="text-center mt-6">
          Sudah punya akun?
          <button onClick={() => router.push('/login')} className="text-blue-600 ml-2 hover:underline">
            Login
          </button>
        </div>

        {accountType === 'courier' && (
          <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
            Setelah mendaftar sebagai kurir, akun Anda akan ditinjau oleh admin cabang terlebih dahulu. Anda dapat login setelah lamaran disetujui.
          </div>
        )}
      </div>
    </div>
  );
}
