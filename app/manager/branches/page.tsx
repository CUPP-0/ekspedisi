'use client';

import { useEffect, useState } from 'react';
import AddModal from './AddModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

interface Branch {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
}

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  async function getBranches() {
    try {
      const res = await fetch('/api/branches');
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBranches();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Data Cabang</h1>

        <button onClick={() => setOpenAdd(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          + Tambah Cabang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">No</th>

              <th className="text-left p-4">Cabang</th>

              <th className="text-left p-4">Kota</th>

              <th className="text-left p-4">Alamat</th>

              <th className="text-left p-4">Telepon</th>

              <th className="text-center p-4">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-10">
                  Loading...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-10">
                  Belum ada data.
                </td>
              </tr>
            ) : (
              branches.map((branch, index) => (
                <tr key={branch.id} className="border-t">
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4">{branch.name}</td>

                  <td className="p-4">{branch.city}</td>

                  <td className="p-4">{branch.address}</td>

                  <td className="p-4">{branch.phone}</td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBranch(branch);
                          setOpenEdit(true);
                        }}
                        className="bg-yellow-500 text-white px-4 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBranch(branch);
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
      <AddModal open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={getBranches} />
      <EditModal
        open={openEdit}
        branch={selectedBranch}
        onClose={() => {
          setOpenEdit(false);
          setSelectedBranch(null);
        }}
        onSuccess={getBranches}
      />
      <DeleteModal
        open={openDelete}
        branch={selectedBranch}
        onClose={() => {
          setOpenDelete(false);
          setSelectedBranch(null);
        }}
        onSuccess={getBranches}
      />
    </div>
  );
}
