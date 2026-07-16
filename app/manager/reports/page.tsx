"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Package,
  Filter,
  Calendar,
  MapPin,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  Clock,
  TrendingUp,
  Hash,
  Building2,
  DollarSign,
  Weight,
  Eye,
  ChevronRight,
  X,
  Users,
  Truck,
  AlertCircle,
} from "lucide-react";

interface Report {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin_branch: string;
  destination_branch: string;
  status: string;
  total_price: number;
  total_weight: number;
  created_at: string;
}

interface Summary {
  totalShipment: number;
  totalRevenue: number;
  delivered: number;
  pending: number;
}

interface Branch {
  id: number;
  name: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadBranches();
    loadReports();
  }, []);

  async function loadBranches() {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/manager/reports?start=${start}&end=${end}&branch=${branch}&status=${status}`
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
    if (branch) params.set("branch", branch);
    if (status) params.set("status", status);
    return params.toString();
  }

  function downloadPdf() {
    if (!summary) {
      alert("Data belum tersedia");
      return;
    }

    const doc = new jsPDF("landscape", "mm", "a4");

    // HEADER
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SHIPMENT REPORT", 148, 18, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Printed : ${new Date().toLocaleString("id-ID")}`, 148, 25, { align: "center" });
    doc.text(`Period : ${start || "-"}  s/d  ${end || "-"}`, 148, 31, { align: "center" });

    // SUMMARY
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", 14, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Shipment : ${summary.totalShipment}`, 14, 54);
    doc.text(`Delivered : ${summary.delivered}`, 14, 60);
    doc.text(`Pending : ${summary.pending}`, 14, 66);
    doc.text(`Revenue : Rp ${Number(summary.totalRevenue).toLocaleString("id-ID")}`, 14, 72);

    // TABLE
    autoTable(doc, {
      startY: 80,
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
        [
          "No",
          "Tracking",
          "Sender",
          "Receiver",
          "Origin",
          "Destination",
          "Status",
          "Weight",
          "Price",
        ],
      ],
      body: reports.map((item, index) => [
        index + 1,
        item.tracking_number,
        item.sender_name,
        item.receiver_name,
        item.origin_branch,
        item.destination_branch,
        item.status.replaceAll("_", " "),
        `${item.total_weight} Kg`,
        `Rp ${Number(item.total_price).toLocaleString("id-ID")}`,
      ]),
    });

    // FOOTER
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${pages}`, 285, 205, { align: "right" });
    }

    doc.save(`Shipment_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  function downloadExcel() {
    window.open(`/api/manager/reports/excel?${buildQuery()}`, "_blank");
  }

  // Status config untuk badge
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending", dot: "bg-yellow-500" },
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Ditugaskan", dot: "bg-blue-500" },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Diambil", dot: "bg-indigo-500" },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500" },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: Building2, label: "Tiba di Cabang", dot: "bg-orange-500" },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500" },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Dibatalkan", dot: "bg-red-500" },
  };

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/manager" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Shipment Reports</span>
      </div>

      {/* ============ HEADER & ACTIONS ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Laporan Pengiriman
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau dan ekspor data seluruh pengiriman
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadReports}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>

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

          {/* Cabang */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Building2 size={14} className="text-gray-500" />
              Cabang
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            >
              <option value="">Semua Cabang</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CheckCircle2 size={14} className="text-gray-500" />
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="arrived_at_branch">Arrived At Branch</option>
              <option value="out_for_delivery">Out For Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Package className="text-red-600" size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Shipment</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {summary?.totalShipment ?? 0}
          </h3>
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
            Rp {Number(summary?.totalRevenue ?? 0).toLocaleString("id-ID")}
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
          <p className="text-sm text-gray-500 mb-1">Delivered</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {summary?.delivered ?? 0}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-50 w-11 h-11 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
              Pending
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Menunggu Proses</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {summary?.pending ?? 0}
          </h3>
        </div>
      </div>

      {/* ============ REPORTS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Memuat laporan...</p>
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
              Coba ubah filter tanggal, cabang, atau status untuk menemukan data yang Anda cari.
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
                    Pengirim / Penerima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Berat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ongkir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((item) => {
                  const statusCfg = statusConfig[item.status] || statusConfig.pending;
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
                        <div className="space-y-1">
                          <div>
                            <p className="text-xs text-gray-500">Pengirim</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.sender_name}
                            </p>
                          </div>
                          <div className="pt-1 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Penerima</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {item.receiver_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs">
                          <div>
                            <p className="text-gray-500 mb-0.5">Dari</p>
                            <p className="font-semibold text-gray-900">
                              {item.origin_branch}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-red-500 px-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            <div className="w-4 h-px bg-red-300" />
                            <ChevronRight size={10} />
                          </div>
                          <div>
                            <p className="text-gray-500 mb-0.5">Ke</p>
                            <p className="font-semibold text-gray-900">
                              {item.destination_branch}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Weight size={14} className="text-gray-400" />
                          {item.total_weight} Kg
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          Rp {Number(item.total_price).toLocaleString("id-ID")}
                        </span>
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
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar size={12} className="text-gray-400" />
                          <span>
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/manager/shipments/${item.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={14} />
                          Detail
                        </Link>
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