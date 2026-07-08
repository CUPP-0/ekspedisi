"use client";

interface Branch {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  branch: Branch | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({
  open,
  branch,
  onClose,
  onSuccess,
}: Props) {
  if (!open || !branch) return null;

  async function handleDelete() {
    try {
      const res = await fetch(`/api/branches/${branch.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Cabang berhasil dihapus");

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-3">
          Hapus Cabang
        </h2>

        <p className="text-gray-600">
          Yakin ingin menghapus cabang
          <span className="font-semibold"> {branch.name}</span>?
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