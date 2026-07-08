"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Application {
  id: number;
  branch_id: number;

  name: string;
  email: string;
  phone: string;
  address: string;

  status: string;

  created_at: string;
  approved_at: string | null;

  branch_name: string;
  branch_city: string;

  rejection_reason: string | null;
}

export default function DetailCourierApplicationPage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [application, setApplication] =
    useState<Application | null>(null);

  const [showReject, setShowReject] = useState(false);

  const [reason, setReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    setLoading(true);

    const res = await fetch(
      `/api/admin/courier-applications/${id}`
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      router.back();
      return;
    }

    setApplication(data);

    setLoading(false);
  }

  async function approve() {

    if (!confirm("Approve kurir ini?")) {
      return;
    }

    const res = await fetch(
      `/api/admin/courier-applications/${id}/approve`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Kurir berhasil disetujui.");

    loadData();
  }

  async function reject() {

    const res = await fetch(
      `/api/admin/courier-applications/${id}/reject`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          reason,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Lamaran berhasil ditolak.");

    setShowReject(false);

    loadData();
  }

  function badge(status: string) {

    switch (status) {

      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            Pending
          </span>
        );

      case "approved":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Approved
          </span>
        );

      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Rejected
          </span>
        );

      default:
        return status;
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold">
          Detail Lamaran Kurir
        </h1>

        <div className="mt-4 flex gap-3 items-center">

          {badge(application.status)}

          <span className="text-gray-500">
            {application.branch_name}
          </span>

        </div>

      </div>
            <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Informasi Pelamar
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <p className="text-gray-500">Nama</p>
            <p className="font-semibold">
              {application.name}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">
              {application.email}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Nomor HP</p>
            <p className="font-semibold">
              {application.phone}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Cabang</p>
            <p className="font-semibold">
              {application.branch_name}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-500">
              Alamat
            </p>

            <p className="font-semibold">
              {application.address || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Tanggal Daftar
            </p>

            <p className="font-semibold">
              {new Date(
                application.created_at
              ).toLocaleString()}
            </p>
          </div>

          {application.approved_at && (
            <div>
              <p className="text-gray-500">
                Tanggal Approve
              </p>

              <p className="font-semibold">
                {new Date(
                  application.approved_at
                ).toLocaleString()}
              </p>
            </div>
          )}

        </div>

      </div>

      {application.status === "pending" && (

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Aksi
          </h2>

          <div className="flex gap-4">

            <button
              onClick={approve}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Approve
            </button>

            <button
              onClick={() => setShowReject(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Reject
            </button>

          </div>

        </div>

      )}

      {application.status === "approved" && (

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">

          <h3 className="font-bold text-green-700">
            Kurir telah disetujui.
          </h3>

        </div>

      )}

      {application.status === "rejected" && (

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">

          <h3 className="font-bold text-red-700">
            Lamaran ditolak.
          </h3>

          <p className="mt-3">
            {application.rejection_reason || "-"}
          </p>

        </div>

      )}

      {showReject && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl p-6 w-full max-w-lg">

            <h2 className="text-xl font-bold mb-5">
              Tolak Lamaran
            </h2>

            <textarea
              rows={5}
              className="border rounded-lg w-full p-3"
              placeholder="Alasan penolakan..."
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setShowReject(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={reject}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Tolak
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );

}