"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  Search,
  MessageCircleQuestion,
  Phone,
  Mail,
  MessageSquare,
  Package,
  CreditCard,
  MapPin,
  HelpCircle,
} from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      category: "Tracking",
      categoryIcon: MapPin,
      question: "Bagaimana cara melacak paket?",
      answer:
        "Masukkan nomor resi pada kolom lacak di halaman utama, kemudian klik tombol Lacak untuk melihat status pengiriman secara real-time.",
    },
    {
      category: "Pengiriman",
      categoryIcon: Package,
      question: "Kapan paket mulai dikirim?",
      answer:
        "Paket akan diproses setelah pembayaran berhasil diverifikasi dan admin cabang menugaskan kurir untuk mengambil paket.",
    },
    {
      category: "Tracking",
      categoryIcon: MapPin,
      question: "Apakah saya bisa mengetahui posisi paket?",
      answer:
        "Ya. Setiap perubahan status pengiriman akan tercatat pada halaman tracking sehingga Anda dapat memantau perjalanan paket kapan saja.",
    },
    {
      category: "Pengiriman",
      categoryIcon: Package,
      question: "Bagaimana jika paket belum sampai?",
      answer:
        "Silakan cek status terakhir melalui fitur tracking. Jika terdapat kendala, hubungi admin cabang atau layanan pelanggan kami 24/7.",
    },
    {
      category: "Pembayaran",
      categoryIcon: CreditCard,
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Kami menerima pembayaran via transfer bank, e-wallet (OVO, GoPay, DANA), QRIS, dan virtual account dari berbagai bank.",
    },
    {
      category: "Kurir",
      categoryIcon: HelpCircle,
      question: "Apakah kurir dapat mengubah status pengiriman?",
      answer:
        "Ya. Kurir akan memperbarui status paket sesuai proses pengiriman (pickup, transit, out for delivery, delivered) hingga paket diterima oleh penerima.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ["Semua", ...new Set(faqs.map((f) => f.category))];
    return cats;
  }, []);

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        activeCategory === "Semua" || faq.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="faq" className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-red-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-72 h-72 bg-orange-200 rounded-full opacity-20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            FAQ
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Pertanyaan yang <span className="text-red-600">Sering Ditanyakan</span>
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Temukan jawaban dari pertanyaan yang paling sering ditanyakan 
            oleh pelanggan kami.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: FAQ List */}
          <div className="lg:col-span-2">

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
              <div className="flex items-center gap-3 px-4 py-2">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <MessageCircleQuestion className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500">Tidak ada pertanyaan yang cocok dengan pencarian Anda.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const CategoryIcon = faq.categoryIcon;
                  const originalIndex = faqs.findIndex((f) => f.question === faq.question);
                  const isOpen = openIndex === originalIndex;

                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-red-200 shadow-lg"
                          : "border-gray-100 shadow-sm hover:shadow-md hover:border-red-100"
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : originalIndex)}
                        className="w-full flex justify-between items-start gap-4 px-6 py-5 text-left group"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          {/* Number */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                            isOpen
                              ? "bg-red-600 text-white"
                              : "bg-red-50 text-red-600"
                          }`}>
                            {String(originalIndex + 1).padStart(2, "0")}
                          </div>

                          <div className="flex-1">
                            {/* Category badge */}
                            <div className="flex items-center gap-1.5 mb-2">
                              <CategoryIcon size={12} className="text-gray-400" />
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {faq.category}
                              </span>
                            </div>

                            {/* Question */}
                            <span className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                              {faq.question}
                            </span>
                          </div>
                        </div>

                        {/* Chevron */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isOpen
                            ? "bg-red-600 text-white rotate-180"
                            : "bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-600"
                        }`}>
                          <ChevronDown size={16} />
                        </div>
                      </button>

                      {/* Answer with smooth animation */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-6 pb-5 pl-20">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Support CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                
                {/* Decorative */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-800 rounded-full opacity-30 blur-2xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
                    BUTUH BANTUAN?
                  </div>

                  <h3 className="text-2xl font-bold mb-3">
                    Masih Ada Pertanyaan?
                  </h3>

                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    Tim customer service kami siap membantu Anda 24/7. 
                    Jangan ragu untuk menghubungi kami.
                  </p>

                  {/* Contact options */}
                  <div className="space-y-3 mb-6">
                    <a
                      href="tel:+62211234567"
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors"
                    >
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Telepon</p>
                        <p className="font-semibold text-sm">(021) 1234-567</p>
                      </div>
                    </a>

                    <a
                      href="mailto:support@ekspedisi.com"
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors"
                    >
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Email</p>
                        <p className="font-semibold text-sm">support@ekspedisi.com</p>
                      </div>
                    </a>

                    <a
                      href="/chat"
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors"
                    >
                      <div className="bg-white/20 p-2 rounded-lg">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/70">Live Chat</p>
                        <p className="font-semibold text-sm">Chat dengan admin</p>
                      </div>
                    </a>
                  </div>

                  <button className="w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                    Hubungi Kami
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}