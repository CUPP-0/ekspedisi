"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CourierApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  branch_name: string;
}

export default function CourierApplicationPage() {

  const [loading, setLoading] = useState(true);

  const [applications, setApplications] = useState<
    CourierApplication[]
  >([]);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {

    setLoading(true);

    const res = await fetch(
      "/api/admin/courier-applications"
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setApplications(data);

    setLoading(false);
  }

  function badge(status: string) {

    switch (status) {

      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            Pending
          </span>
        );

      case "approved":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Approved
          </span>
        );

      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
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

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Lamaran Kurir
        </h1>

        <p className="text-gray-500 mt-2">
          Daftar calon kurir yang mendaftar.
        </p>

      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Nama
              </th>

              <th className="text-left">
                Email
              </th>

              <th className="text-left">
                HP
              </th>

              <th className="text-left">
                Cabang
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {applications.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-10"
                >
                  Belum ada lamaran.
                </td>

              </tr>

            )}

            {applications.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-4">
                  {item.name}
                </td>

                <td>
                  {item.email}
                </td>

                <td>
                  {item.phone}
                </td>

                <td>
                  {item.branch_name}
                </td>

                <td>
                  {badge(item.status)}
                </td>

                <td>

                  <Link
                    href={`/admin/courier-applications/${item.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Detail
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );

}