"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  FileSpreadsheet,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Receipt,
  CreditCard,
  Hash,
  User,
  ChevronRight,
  X,
} from "lucide-react";

interface PaymentReport {
  id: number;
  order_id: string;
  transaction_id: string;
  tracking_number: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  created_at: string;
}

interface Summary {
  totalPayment: number;
  totalRevenue: number;
  paid: number;
  pending: number;
  failed: number;
}

export default function PaymentReportsPage() {
  const [reports, setReports] = useState<PaymentReport[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/manager/payment-reports?start=${start}&end=${end}&status=${status}&method=${method}`
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setReports(data.data);
      setSummary(data.summary);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function buildQuery() {
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    if (status) params.set("status", status);
    if (method) params.set("method", method);
    return params.toString();
  }

  function downloadExcel() {
    window.open(`/api/manager/payment-reports/excel?${buildQuery()}`, "_blank");
  }

  function downloadPdf() {
    if (!summary) return;

    const doc = new jsPDF("landscape", "mm", "a4");

    // HEADER
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT REPORT", 148, 18, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Printed : ${new Date().toLocaleString("id-ID")}`, 148, 25, { align: "center" });
    doc.text(`Period : ${start || "-"} s/d ${end || "-"}`, 148, 31, { align: "center" });

    // SUMMARY
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Payment : ${summary.totalPayment}`, 14, 54);
    doc.text(`Paid : ${summary.paid}`, 14, 60);
    doc.text(`Pending : ${summary.pending}`, 14, 66);
    doc.text(`Failed : ${summary.failed}`, 14, 72);
    doc.text(`Revenue : Rp ${Number(summary.totalRevenue).toLocaleString("id-ID")}`, 14, 78);

    // TABLE
    autoTable(doc, {
      startY: 86,
      theme: "grid",
      headStyles: {
        fillColor: [220, 38, 38], // Red-600
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      head: [
        ["No", "Tracking", "Customer", "Method", "Status", "Amount", "Date"],
      ],
      body: reports.map((item, index) => [
        index + 1,
        item.tracking_number,
        item.customer_name,
        item.payment_method || "-",
        item.payment_status.replaceAll("_", " "),
        `Rp ${Number(item.amount).toLocaleString("id-ID")}`,
        new Date(item.payment_date).toLocaleDateString("id-ID"),
      ]),
    });

    // FOOTER
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${pages}`, 285, 205, { align: "right" });
    }

    doc.save(`Payment_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  // Status config untuk badge
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas", dot: "bg-green-500" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending", dot: "bg-yellow-500" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal", dot: "bg-red-500" },
  };

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/manager" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Payment Reports</span>
      </div>

      {/* ============ HEADER & ACTIONS ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Laporan Pembayaran
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau dan ekspor data seluruh transaksi pembayaran
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all shadow-md shadow-red-200"
          >
            <FileText size={16} />
            <span>Export PDF</span>
          </button>

          <button
            onClick={downloadExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold transition-all shadow-md shadow-emerald-200"
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* ============ FILTER CARD ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Filter size={18} className="text-red-600" />
          <h2 className="text-lg font-bold text-gray-900">Filter Laporan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tanggal Awal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={14} className="text-gray-500" />
              Tanggal Awal
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>

          {/* Tanggal Akhir */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={14} className="text-gray-500" />
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CheckCircle2 size={14} className="text-gray-500" />
              Status Pembayaran
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            >
              <option value="">Semua Status</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="pending">Pending</option>
              <option value="failed">Gagal (Failed)</option>
            </select>
          </div>

          {/* Metode */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CreditCard size={14} className="text-gray-500" />
              Metode Pembayaran
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            >
              <option value="">Semua Metode</option>
              <option value="transfer">Transfer Bank</option>
              <option value="ewallet">E-Wallet</option>
              <option value="cod">COD</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={loadReports}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300"
          >
            <Filter size={18} />
            <span>Tampilkan Laporan</span>
          </button>
        </div>
      </div>

      {/* ============ SUMMARY STATS ============ */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
                <Receipt className="text-red-600" size={20} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.totalPayment}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-emerald-50 w-11 h-11 rounded-xl flex items-center justify-center">
                <DollarSign className="text-emerald-600" size={20} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-xl font-bold text-gray-900">
              Rp {Number(summary.totalRevenue).toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-50 w-11 h-11 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                Sukses
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Lunas (Paid)</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.paid}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-yellow-50 w-11 h-11 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                Menunggu
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.pending}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                Gagal
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Failed</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.failed}</h3>
          </div>
        </div>
      )}

      {/* ============ REPORTS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Memuat laporan pembayaran...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Tidak ada data laporan
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Coba ubah filter tanggal, status, atau metode pembayaran untuk menemukan data yang Anda cari.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    No. Resi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((item) => {
                  const statusCfg = statusConfig[item.payment_status] || statusConfig.pending;
                  const StatusIcon = statusCfg.icon;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <Hash size={16} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {item.tracking_number}
                            </p>
                            <p className="text-xs text-gray-500">Nomor Resi</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.customer_name?.charAt(0).toUpperCase() || "C"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.customer_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-1.5 rounded-lg">
                            <CreditCard size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {item.payment_method?.replaceAll("_", " ") || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {Number(item.amount).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(item.payment_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}