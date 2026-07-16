"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  User,
  MapPin,
  Phone,
  Home,
  Building2,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  Weight,
  Hash,
  FileText,
  Plus,
  Edit3,
  X,
  ChevronRight,
  ArrowLeft,
  PackagePlus,
} from "lucide-react";

interface Shipment {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  origin_branch: string;
  destination_branch: string;
  total_weight: number;
  total_price: number;
  payment_status: string;
  status: string;
  courier_id: number | null;
  courier_name: string | null;
  courier_phone: string | null;
  created_at?: string;
}

export default function DetailShipmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [trackings, setTrackings] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [courierId, setCourierId] = useState("");
  const [showCourier, setShowCourier] = useState(false);
  const [openTracking, setOpenTracking] = useState(false);
  const [editingTracking, setEditingTracking] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [trackingForm, setTrackingForm] = useState({
    status: "",
    location: "",
    description: "",
  });

  function openAddTracking() {
    setEditingTracking(null);
    setTrackingForm({ status: "", location: "", description: "" });
    setOpenTracking(true);
  }

  function openEditTracking(tracking: any) {
    setEditingTracking(tracking);
    setTrackingForm({
      status: tracking.status,
      location: tracking.location,
      description: tracking.description || "",
    });
    setOpenTracking(true);
  }

  useEffect(() => {
    loadShipment();
  }, []);

  async function loadShipment() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/shipments/${id}`);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShipment(data.shipment);
      setItems(data.items);
      setTrackings(data.trackings);
      setCouriers(data.couriers);

      if (data.shipment.courier_id) {
        setCourierId(String(data.shipment.courier_id));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // Status config
  const statusConfig: Record<
    string,
    { bg: string; text: string; icon: any; label: string; dot: string; step: number }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Menunggu Pembayaran", dot: "bg-yellow-500", step: 0 },
    assigned: { bg: "bg-blue-100", text: "text-blue-700", icon: Users, label: "Kurir Ditugaskan", dot: "bg-blue-500", step: 1 },
    picked_up: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Package, label: "Paket Diambil", dot: "bg-indigo-500", step: 2 },
    in_transit: { bg: "bg-purple-100", text: "text-purple-700", icon: Truck, label: "Dalam Perjalanan", dot: "bg-purple-500", step: 3 },
    arrived_at_branch: { bg: "bg-orange-100", text: "text-orange-700", icon: Building2, label: "Tiba di Cabang", dot: "bg-orange-500", step: 4 },
    out_for_delivery: { bg: "bg-pink-100", text: "text-pink-700", icon: MapPin, label: "Dalam Pengantaran", dot: "bg-pink-500", step: 5 },
    delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Terkirim", dot: "bg-green-500", step: 6 },
    cancelled: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Dibatalkan", dot: "bg-red-500", step: 0 },
  };

  const paymentConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Lunas" },
    failed: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Gagal" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
  };

  const currentStatus = statusConfig[shipment?.status || "pending"] || statusConfig.pending;
  const currentPayment = paymentConfig[shipment?.payment_status || "pending"] || paymentConfig.pending;
  const StatusIcon = currentStatus.icon;
  const PaymentIcon = currentPayment.icon;

  // Tracking steps
  const trackingSteps = [
    { icon: Users, label: "Ditugaskan", status: "assigned" },
    { icon: Package, label: "Diambil", status: "picked_up" },
    { icon: Truck, label: "Perjalanan", status: "in_transit" },
    { icon: Building2, label: "Tiba Cabang", status: "arrived_at_branch" },
    { icon: MapPin, label: "Pengantaran", status: "out_for_delivery" },
    { icon: CheckCircle2, label: "Terkirim", status: "delivered" },
  ];

  async function assignCourier() {
    if (!courierId) {
      alert("Pilih kurir.");
      return;
    }

    const res = await fetch("/api/admin/shipments/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipment_id: id, courier_id: courierId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Kurir berhasil ditugaskan.");
    setShowCourier(false);
    loadShipment();
  }

  async function saveTracking() {
    setSaving(true);
    let url = "/api/admin/shipments/tracking";
    let method = "POST";

    if (editingTracking) {
      url = `/api/admin/shipments/tracking/${editingTracking.id}`;
      method = "PUT";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id: id, ...trackingForm }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(editingTracking ? "Tracking berhasil diperbarui." : "Tracking berhasil ditambahkan.");
      setOpenTracking(false);
      setEditingTracking(null);
      setTrackingForm({ status: "", location: "", description: "" });
      loadShipment();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat detail shipment...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Shipment Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Shipment yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => router.push("/admin/shipments")}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Shipments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============ BREADCRUMB ============ */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/dashboard" className="hover:text-red-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/admin/shipments" className="hover:text-red-600 transition-colors">
          Shipments
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-semibold">Detail</span>
      </div>

      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-red-600" />
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {shipment.tracking_number}
                </h1>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
                <StatusIcon size={14} />
                {currentStatus.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${currentPayment.bg} ${currentPayment.text}`}>
                <PaymentIcon size={14} />
                {currentPayment.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Detail lengkap pengiriman dan tracking paket
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddTracking}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 hover:shadow-red-300 flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Tambah Tracking</span>
          </button>
        </div>
      </div>

      {/* ============ PROGRESS TRACKING ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <Truck className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Progress Pengiriman</h2>
              <p className="text-sm text-gray-500">Status terkini paket</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStatus.step / 6) * 100}%` }}
              />
            </div>

            {/* Steps */}
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index < currentStatus.step;
              const isCurrent = index === currentStatus.step - 1;

              return (
                <div key={index} className="relative flex flex-col items-center z-10 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-red-100" : ""}`}
                  >
                    <Icon size={20} />
                  </div>
                  <p className={`mt-3 text-xs font-semibold text-center ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sender */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Pengirim</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                <User className="text-green-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama</p>
                <p className="font-semibold text-gray-900">{shipment.sender_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                <Phone className="text-green-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Telepon</p>
                <p className="font-semibold text-gray-900">{shipment.sender_phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                <MapPin className="text-green-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Alamat</p>
                <p className="font-semibold text-gray-900">{shipment.sender_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Receiver */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Penerima</h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                <User className="text-purple-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama</p>
                <p className="font-semibold text-gray-900">{shipment.receiver_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                <Phone className="text-purple-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Telepon</p>
                <p className="font-semibold text-gray-900">{shipment.receiver_phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                <MapPin className="text-purple-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Alamat</p>
                <p className="font-semibold text-gray-900">{shipment.receiver_address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ROUTE & COURIER ============ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Route */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                <MapPin className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Rute Pengiriman</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                    <MapPin size={20} />
                  </div>
                  <div className="w-0.5 h-12 bg-gradient-to-b from-red-300 to-orange-300 mt-2" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-xs text-gray-500 mb-1">Cabang Asal</p>
                  <p className="font-bold text-gray-900 text-lg">{shipment.origin_branch}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                    <Home size={20} />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-xs text-gray-500 mb-1">Cabang Tujuan</p>
                  <p className="font-bold text-gray-900 text-lg">{shipment.destination_branch}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Berat</p>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  <Weight size={14} className="text-red-600" />
                  {shipment.total_weight} Kg
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Ongkir</p>
                <p className="font-bold text-red-600 flex items-center gap-1">
                  <DollarSign size={14} />
                  Rp {Number(shipment.total_price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courier */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                <Truck className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Kurir</h2>
            </div>
          </div>

          <div className="p-6">
            {shipment.courier_name ? (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {shipment.courier_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{shipment.courier_name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone size={12} />
                      {shipment.courier_phone}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={18} />
                    <p className="text-sm font-semibold text-green-700">Kurir telah ditugaskan</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCourier(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  <span>Ganti Kurir</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-gray-50 rounded-xl p-6 text-center mb-4">
                  <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-500 font-medium mb-1">Belum ada kurir</p>
                  <p className="text-xs text-gray-400">
                    {shipment.payment_status === "paid"
                      ? "Tugaskan kurir untuk mengambil paket"
                      : "Menunggu pembayaran selesai"}
                  </p>
                </div>

                <button
                  onClick={() => setShowCourier(true)}
                  disabled={shipment.payment_status !== "paid"}
                  className={`w-full font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    shipment.payment_status === "paid"
                      ? "bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg shadow-red-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Users size={16} />
                  <span>
                    {shipment.payment_status === "paid" ? "Assign Kurir" : "Menunggu Pembayaran"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ ITEMS TABLE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-2 rounded-lg">
              <PackagePlus className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daftar Barang</h2>
              <p className="text-sm text-gray-500">{items.length} item dalam pengiriman</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Berat
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Berat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Package className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">Belum ada barang</p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 w-9 h-9 rounded-lg flex items-center justify-center">
                          <Package size={16} className="text-indigo-600" />
                        </div>
                        <span className="font-semibold text-gray-900">{item.item_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                        {item.quantity} pcs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.weight} Kg</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {(item.quantity * item.weight).toFixed(2)} Kg
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ TRACKING TIMELINE ============ */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                <Clock className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Riwayat Tracking</h2>
                <p className="text-sm text-gray-500">{trackings.length} update status</p>
              </div>
            </div>

            <button
              onClick={openAddTracking}
              className="hidden sm:flex items-center gap-2 bg-white hover:bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            >
              <Plus size={16} />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {trackings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-gray-400" size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada tracking</h3>
              <p className="text-gray-500 text-sm mb-6">
                Tambahkan tracking pertama untuk memantau perjalanan paket
              </p>
              <button
                onClick={openAddTracking}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                Tambah Tracking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {trackings.map((tracking, index) => {
                const trackStatus = statusConfig[tracking.status] || statusConfig.pending;
                const TrackIcon = trackStatus.icon;
                return (
                  <div key={tracking.id} className="relative flex gap-4 group">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${trackStatus.bg} ${trackStatus.text} shadow-sm`}
                      >
                        <TrackIcon size={18} />
                      </div>
                      {index < trackings.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent mt-2 min-h-[40px]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 hover:bg-white border border-gray-100 hover:border-red-200 rounded-xl p-4 transition-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${trackStatus.bg} ${trackStatus.text}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${trackStatus.dot}`} />
                              {tracking.status.replaceAll("_", " ")}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900">{tracking.location}</h3>
                        </div>

                        <button
                          onClick={() => openEditTracking(tracking)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>

                      {tracking.description && (
                        <p className="text-sm text-gray-600">{tracking.description}</p>
                      )}

                      {tracking.created_at && (
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(tracking.created_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============ TRACKING MODAL ============ */}
      {openTracking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingTracking ? "Edit Tracking" : "Tambah Tracking"}
                  </h2>
                  <p className="text-xs text-gray-500">Update status pengiriman</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpenTracking(false);
                  setEditingTracking(null);
                }}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={14} className="text-red-600" />
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  value={trackingForm.status}
                  onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                >
                  <option value="">Pilih Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="arrived_at_branch">Arrived At Branch</option>
                  <option value="out_for_delivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={14} className="text-red-600" />
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                  placeholder="Contoh: Hub Cirebon, Dalam perjalanan ke Bekasi"
                  value={trackingForm.location}
                  onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={14} className="text-red-600" />
                  Keterangan
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
                  placeholder="Tambahkan keterangan detail..."
                  value={trackingForm.description}
                  onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpenTracking(false);
                  setEditingTracking(null);
                  setTrackingForm({ status: "", location: "", description: "" });
                }}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveTracking}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>{editingTracking ? "Update Tracking" : "Simpan Tracking"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ COURIER MODAL ============ */}
      {showCourier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <Truck className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Pilih Kurir</h2>
                  <p className="text-xs text-gray-500">Tugaskan kurir untuk shipment ini</p>
                </div>
              </div>
              <button
                onClick={() => setShowCourier(false)}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Users size={14} className="text-blue-600" />
                Kurir <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                value={courierId}
                onChange={(e) => setCourierId(e.target.value)}
              >
                <option value="">Pilih Kurir</option>
                {couriers.map((courier) => (
                  <option key={courier.id} value={courier.id}>
                    {courier.name}
                  </option>
                ))}
              </select>

              {couriers.length === 0 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-yellow-800">
                    Belum ada kurir tersedia. Tambahkan kurir terlebih dahulu.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCourier(false)}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 hover:text-red-600 transition-all"
              >
                Batal
              </button>
              <button
                onClick={assignCourier}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold transition-all shadow-lg shadow-red-200 flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}