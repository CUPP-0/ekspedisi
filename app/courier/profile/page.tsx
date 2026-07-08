'use client';

import { useEffect, useState } from 'react';

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;

  branch_name: string;
  city: string;
  address: string;
  branch_phone: string;
}

interface Stats {
  assigned: number;
  in_progress: number;
  delivered: number;
}

export default function CourierProfilePage() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    const res = await fetch('/api/courier/profile');

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setProfile(data.profile);

    setStats(data.stats);

    setLoading(false);
  }

  async function changePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Konfirmasi password tidak sama.');

      return;
    }

    const res = await fetch('/api/courier/profile/password', {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(passwordForm),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert('Password berhasil diubah.');

    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!profile || !stats) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">Profile Kurir</h1>

        <p className="text-gray-500 mt-2">Informasi akun dan statistik pengiriman.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profil */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Informasi Kurir</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Nama</p>
              <p className="font-semibold">{profile.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold">{profile.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Nomor HP</p>
              <p className="font-semibold">{profile.phone || '-'}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-semibold capitalize">{profile.role}</p>
            </div>

            <div>
              <p className="text-gray-500">Bergabung</p>
              <p className="font-semibold">{new Date(profile.created_at).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Cabang */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Informasi Cabang</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Nama Cabang</p>
              <p className="font-semibold">{profile.branch_name}</p>
            </div>

            <div>
              <p className="text-gray-500">Kota</p>
              <p className="font-semibold">{profile.city}</p>
            </div>

            <div>
              <p className="text-gray-500">Alamat</p>
              <p className="font-semibold">{profile.address}</p>
            </div>

            <div>
              <p className="text-gray-500">Telepon Cabang</p>
              <p className="font-semibold">{profile.branch_phone || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-5">Statistik Pengiriman</h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-blue-50 rounded-lg p-5">
            <p className="text-gray-500 text-sm">Assigned</p>

            <h3 className="text-3xl font-bold mt-2">{stats.assigned}</h3>
          </div>

          <div className="bg-yellow-50 rounded-lg p-5">
            <p className="text-gray-500 text-sm">Dalam Proses</p>

            <h3 className="text-3xl font-bold mt-2">{stats.in_progress}</h3>
          </div>

          <div className="bg-green-50 rounded-lg p-5">
            <p className="text-gray-500 text-sm">Delivered</p>

            <h3 className="text-3xl font-bold mt-2">{stats.delivered}</h3>
          </div>
        </div>
      </div>

      {/* Password */}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-5">Ubah Password</h2>

        <div className="space-y-4">
          <input
            type="password"
            className="border rounded-lg w-full p-3"
            placeholder="Password Lama"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                oldPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="border rounded-lg w-full p-3"
            placeholder="Password Baru"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="border rounded-lg w-full p-3"
            placeholder="Konfirmasi Password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
          />

          <button onClick={changePassword} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Simpan Password
          </button>
        </div>
      </div>
    </div>
  );
}
