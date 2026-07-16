'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, User, Search, LogOut, Plus, Minus, Trash2, MapPin, Truck, DollarSign, Weight, Calendar, ArrowLeft, ChevronRight, Bell, Menu, X, PackagePlus, AlertCircle, CheckCircle2, Clock, Star } from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  city?: string;
}

interface Customer {
  id: number;
  name: string;
  email?: string;
}

interface Rate {
  id: number;
  origin_city: string;
  destination_city: string;
  price_per_kg: number;
  estimated_days: number;
}

export default function CreateShipmentPage() {
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [rate, setRate] = useState<Rate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    receiver_id: '',
    origin_branch_id: '',
    destination_branch_id: '',
    rate_id: '',
  });

  const [items, setItems] = useState([
    {
      item_name: '',
      quantity: 1,
      weight: 0,
      photo: null as File | null,
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  async function getRate() {
    if (!form.origin_branch_id || !form.destination_branch_id) return;

    try {
      const res = await fetch(`/api/rates/check?origin_branch_id=${form.origin_branch_id}&destination_branch_id=${form.destination_branch_id}`);

      const data = await res.json();

      if (res.ok) {
        setRate(data);
      } else {
        setRate(null);
      }
    } catch (err) {
      console.error(err);
      setRate(null);
    }
  }

  useEffect(() => {
    getRate();
  }, [form.origin_branch_id, form.destination_branch_id]);

  async function loadData() {
    setLoading(true);
    try {
      const [b, c, r] = await Promise.all([fetch('/api/branches/list').then((r) => r.json()), fetch('/api/customers/list').then((r) => r.json()), fetch('/api/rates/list').then((r) => r.json())]);

      console.log('Branches', b);
      console.log('Customers', c);
      console.log('Rates', r);

      setBranches(Array.isArray(b) ? b : []);
      setCustomers(Array.isArray(c) ? c : []);
      setRates(Array.isArray(r) ? r : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function addItem() {
    setItems([
      ...items,
      {
        item_name: '',
        quantity: 1,
        weight: 1,
        photo: null,
      },
    ]);
  }

  function removeItem(index: number) {
    const temp = [...items];
    temp.splice(index, 1);
    setItems(temp);
  }

  function updateItem(index: number, field: string, value: any) {
    const temp = [...items];
    temp[index] = {
      ...temp[index],
      [field]: value,
    };
    setItems(temp);
  }

  const selectedRate = rates.find((r) => r.id == Number(form.rate_id));

  const totalWeight = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.quantity * item.weight;
    }, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    if (!rate) return 0;
    return totalWeight * Number(rate.price_per_kg);
  }, [rate, totalWeight]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!rate) {
      alert('Tarif pengiriman belum tersedia.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('receiver_id', String(form.receiver_id));
      formData.append('origin_branch_id', String(form.origin_branch_id));
      formData.append('destination_branch_id', String(form.destination_branch_id));
      formData.append('rate_id', String(rate.id));
      formData.append('total_weight', String(totalWeight));
      formData.append('total_price', String(totalPrice));

      // Kirim data item tanpa file
      formData.append(
        'items',
        JSON.stringify(
          items.map((item) => ({
            item_name: item.item_name,
            quantity: item.quantity,
            weight: item.weight,
          })),
        ),
      );

      // Kirim file tiap item
      items.forEach((item, index) => {
        if (item.photo) {
          formData.append(`photo_${index}`, item.photo);
        }
      });

      const res = await fetch('/api/customers/shipments', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert('Shipment berhasil dibuat.');
      router.push(`/customer/payment/${data.shipment_id}`);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  }

  // Menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/dashboard', active: false },
    { icon: Package, label: 'Shipments', href: '/customer/shipments', active: true },
    { icon: User, label: 'Profile', href: '/customer/profile', active: false },
    { icon: MapPin, label: 'Alamat', href: '/customer/addresses', active: false },
  ];

  // Origin & destination branch info
  const originBranch = branches.find((b) => b.id == Number(form.origin_branch_id));
  const destinationBranch = branches.find((b) => b.id == Number(form.destination_branch_id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ============ SIDEBAR ============ */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-red-200">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 leading-tight">
                  BAZMA <span className="text-red-600">Express</span>
                </h1>
                <p className="text-[10px] text-gray-500 leading-tight">Customer Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    item.active ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{item.label}</span>
                  {item.active && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Lainnya</p>
              <Link href="/tracking" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                <Search size={20} />
                <span className="text-sm">Lacak Paket</span>
              </Link>
              <Link href="/cek-ongkir" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                <MapPin size={20} />
                <span className="text-sm">Cek Ongkir</span>
              </Link>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button onClick={() => router.push('/logout')} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all">
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 max-w-md flex-1">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Cari nomor resi atau nama penerima..." className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder:text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              </button>

              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">Customer</p>
                  <p className="text-xs text-gray-500 leading-tight">Member</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 max-w-5xl mx-auto">
          {/* Breadcrumb + Header */}
          <div className="mb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Link href="/customer/dashboard" className="hover:text-red-600 transition-colors">
                Dashboard
              </Link>
              <ChevronRight size={14} />
              <Link href="/customer/shipments" className="hover:text-red-600 transition-colors">
                Shipments
              </Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-semibold">Buat Shipment</span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Buat Pengiriman Baru</h1>
                <p className="text-sm text-gray-500 mt-1">Isi form di bawah untuk membuat shipment baru</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ============ PENGIRIM & PENERIMA ============ */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Informasi Pengiriman</h2>
                    <p className="text-sm text-gray-500">Pilih penerima dan cabang</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Penerima */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={16} className="text-red-600" />
                    Penerima <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                    value={form.receiver_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        receiver_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Pilih Penerima</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cabang Asal & Tujuan */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <MapPin size={16} className="text-red-600" />
                      Cabang Asal <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                      value={form.origin_branch_id}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          origin_branch_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Pilih Cabang Asal</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <MapPin size={16} className="text-orange-600" />
                      Cabang Tujuan <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                      value={form.destination_branch_id}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          destination_branch_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Pilih Cabang Tujuan</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Route Visualization */}
                {originBranch && destinationBranch && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Dari</p>
                        <p className="font-bold text-gray-900">{originBranch.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <div className="w-12 h-0.5 bg-red-300" />
                        <Truck size={20} />
                        <div className="w-12 h-0.5 bg-red-300" />
                        <ChevronRight size={16} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Ke</p>
                        <p className="font-bold text-gray-900">{destinationBranch.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============ RATE INFO ============ */}
            {rate && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 border-b border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" size={20} />
                    <h3 className="font-bold text-green-900">Tarif Tersedia</h3>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Harga per Kg</p>
                      <p className="text-2xl font-bold text-gray-900">Rp {Number(rate.price_per_kg).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Clock className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimasi Pengiriman</p>
                      <p className="text-2xl font-bold text-gray-900">{rate.estimated_days} Hari</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!rate && form.origin_branch_id && form.destination_branch_id && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-1">Tarif Tidak Tersedia</h3>
                    <p className="text-sm text-yellow-800">Tidak ada tarif pengiriman untuk rute ini. Silakan pilih cabang lain.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ============ DAFTAR BARANG ============ */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg">
                      <PackagePlus className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Daftar Barang</h2>
                      <p className="text-sm text-gray-500">Tambahkan barang yang akan dikirim ({items.length} item)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-red-200 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-red-500 to-orange-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
                        <h3 className="font-bold text-gray-900">Barang {index + 1}</h3>
                      </div>

                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Nama Barang */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nama Barang <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                          placeholder="Contoh: Dokumen, Elektronik, Pakaian"
                          value={item.item_name}
                          onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                          required
                        />
                      </div>

                      {/* Jumlah & Berat */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Jumlah <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                              required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">pcs</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Berat per Barang <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                              value={item.weight}
                              onChange={(e) => updateItem(index, 'weight', Number(e.target.value))}
                              required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Kg</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Barang</label>

                          <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-lg file:bg-red-600 file:text-white hover:file:bg-red-700"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;

                              const newItems = [...items];
                              newItems[index].photo = file;
                              setItems(newItems);
                            }}
                          />

                          {item.photo && <img src={URL.createObjectURL(item.photo)} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border" />}
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Total Berat Item</span>
                          <span className="font-bold text-gray-900">{(item.quantity * item.weight).toFixed(2)} Kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Item Button */}
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full border-2 border-dashed border-gray-300 hover:border-red-400 rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Plus size={18} />
                  <span>Tambah Barang Lainnya</span>
                </button>
              </div>
            </div>

            {/* ============ SUMMARY ============ */}
            <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={20} className="text-yellow-300 fill-yellow-300" />
                  <h3 className="text-lg font-bold">Ringkasan Pengiriman</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <div className="flex items-center gap-2">
                      <Weight size={18} />
                      <span className="text-sm">Total Berat</span>
                    </div>
                    <span className="text-xl font-bold">{totalWeight.toFixed(2)} Kg</span>
                  </div>

                  {rate && (
                    <div className="flex items-center justify-between pb-3 border-b border-white/20">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} />
                        <span className="text-sm">Harga per Kg</span>
                      </div>
                      <span className="text-xl font-bold">Rp {Number(rate.price_per_kg).toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-yellow-300" />
                      <span className="text-base font-semibold">Total Ongkir</span>
                    </div>
                    <span className="text-3xl font-extrabold text-yellow-300">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !rate}
                  className="w-full bg-white text-red-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Package size={20} />
                      <span>Buat Shipment & Lanjut ke Pembayaran</span>
                    </>
                  )}
                </button>

                {!rate && <p className="text-center text-sm text-white/80 mt-3">Pilih cabang asal dan tujuan untuk melihat tarif</p>}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
