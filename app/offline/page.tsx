export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
        <h1 className="text-3xl font-semibold mb-4">Anda sedang offline</h1>
        <p className="text-slate-600 leading-7">
          Koneksi internet terputus. Halaman statis ini ditampilkan untuk pengalaman offline.
          Silakan coba lagi ketika koneksi tersedia.
        </p>
        <a
          href="/"
          className="inline-flex mt-8 rounded-full bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 transition"
        >
          Kembali ke Home
        </a>
      </div>
    </main>
  );
}
