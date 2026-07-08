"use client";

import { useEffect, useState } from "react";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

interface Admin {
  id: number;
  name: string;
  email: string;
  branch: string;
  branch_id: number;
}

export default function AdminPage() {

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    getAdmins();
  }, []);

  async function getAdmins() {
    setLoading(true);

    const res = await fetch("/api/admins");
    const data = await res.json();

    setAdmins(data);
    setLoading(false);
  }

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Admin Cabang
        </h1>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Tambah Admin
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Cabang</th>
              <th className="p-4 text-center">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={5}
                  className="text-center p-10"
                >
                  Loading...
                </td>
              </tr>

            ) : admins.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="text-center p-10"
                >
                  Belum ada data
                </td>
              </tr>

            ) : (

              admins.map((admin, index) => (

                <tr
                  key={admin.id}
                  className="border-t"
                >

                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{admin.name}</td>
                  <td className="p-4">{admin.email}</td>
                  <td className="p-4">{admin.branch}</td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={()=>{
                          setSelectedAdmin(admin);
                          setOpenEdit(true);
                        }}
                        className="bg-yellow-500 text-white px-4 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={()=>{
                          setSelectedAdmin(admin);
                          setOpenDelete(true);
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <AddModal
        open={openAdd}
        onClose={()=>setOpenAdd(false)}
        onSuccess={getAdmins}
      />

      <EditModal
        open={openEdit}
        admin={selectedAdmin}
        onClose={()=>{
          setOpenEdit(false);
          setSelectedAdmin(null);
        }}
        onSuccess={getAdmins}
      />

      <DeleteModal
        open={openDelete}
        admin={selectedAdmin}
        onClose={()=>{
          setOpenDelete(false);
          setSelectedAdmin(null);
        }}
        onSuccess={getAdmins}
      />

    </div>
  );
}