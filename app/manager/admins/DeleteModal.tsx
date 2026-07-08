"use client";

interface Admin {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  admin: Admin | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({
  open,
  admin,
  onClose,
  onSuccess,
}: Props) {

  if (!open || !admin) return null;

  async function handleDelete() {
    const res = await fetch(`/api/admins/${admin.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Admin berhasil dihapus");

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold">
          Hapus Admin
        </h2>

        <p className="mt-3">
          Yakin ingin menghapus admin
          <b> {admin.name}</b> ?
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-5 py-2 rounded-lg"
          >
            Batal
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Hapus
          </button>

        </div>

      </div>

    </div>
  );
}