'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Package, ArrowUp, Send, Clock, Shield, Award } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <>
      {/* ============ NEWSLETTER SECTION ============ */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-16 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3">Dapatkan Info & Promo Terbaru</h2>
              <p className="text-white/90 text-lg">Subscribe newsletter kami untuk mendapatkan update layanan, promo spesial, dan tips pengiriman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-red-600 rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-orange-600 rounded-full opacity-5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2.5 rounded-xl">
                  <Package className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">BAZMA Express</h2>
                  <p className="text-xs text-gray-400">Solusi Pengiriman Terpercaya</p>
                </div>
              </div>
              <p className="text-gray-400 leading-7 mb-6 max-w-md">
                Solusi pengiriman paket yang cepat, aman, dan terpercaya dengan sistem tracking realtime. Melayani pengiriman ke seluruh Indonesia dengan jaringan luas dan kurir profesional.
              </p>

              {/* Social Media */}
              <div className="flex gap-3 mb-6">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-red-600 border border-white/10 hover:border-transparent p-3 rounded-xl transition-all duration-300 group">
                  <FaFacebook size={20} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-red-600 border border-white/10 hover:border-transparent p-3 rounded-xl transition-all duration-300 group">
                  <FaInstagram size={20} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-red-600 border border-white/10 hover:border-transparent p-3 rounded-xl transition-all duration-300 group">
                  <FaTwitter size={20} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-red-600 border border-white/10 hover:border-transparent p-3 rounded-xl transition-all duration-300 group">
                  <FaYoutube size={20} className="text-gray-400 group-hover:text-white" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                  <Shield size={16} className="text-green-400" />
                  <span className="text-xs text-gray-300">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                  <Award size={16} className="text-yellow-400" />
                  <span className="text-xs text-gray-300">ISO Certified</span>
                </div>
              </div>
            </div>

            {/* Quick Links - Layanan */}
            <div>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-red-600 rounded-full" />
                Layanan
              </h3>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                Perusahaan
              </h3>
            </div>

            {/* Contact & Hours */}
            <div>
              <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-yellow-500 rounded-full" />
                Kontak
              </h3>

              <div className="space-y-4 mb-6">
                <a href="tel:+6281234567890" className="flex items-start gap-3 text-gray-400 hover:text-red-400 transition-colors group">
                  <div className="bg-white/5 group-hover:bg-red-600/20 p-2 rounded-lg transition-colors">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Telepon</p>
                    <p className="text-sm">0812-3456-7890</p>
                  </div>
                </a>

                <a href="mailto:info@bazmaexpress.com" className="flex items-start gap-3 text-gray-400 hover:text-red-400 transition-colors group">
                  <div className="bg-white/5 group-hover:bg-red-600/20 p-2 rounded-lg transition-colors">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm">info@bazmaexpress.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-gray-400">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Alamat</p>
                    <p className="text-sm">
                      Jl. Raya Bogor KM. 22
                      <br />
                      Bogor, Jawa Barat 16914
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-red-400" />
                  <h4 className="font-semibold text-sm">Jam Operasional</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Senin - Jumat</span>
                    <span className="text-gray-300 font-medium">08.00 - 17.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sabtu</span>
                    <span className="text-gray-300 font-medium">08.00 - 15.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minggu & Libur</span>
                    <span className="text-red-400 font-medium">Tutup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Metode Pembayaran</h4>
                <div className="flex flex-wrap gap-2">
                  {['BCA', 'BNI', 'BRI', 'Mandiri', 'OVO', 'GoPay', 'DANA', 'QRIS'].map((method) => (
                    <div key={method} className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:bg-white/10 transition-colors">
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Download Aplikasi</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Download di</p>
                      <p className="text-xs font-semibold">Google Play</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Download di</p>
                      <p className="text-xs font-semibold">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400 text-center md:text-left">
                © {new Date().getFullYear()} <span className="text-red-400 font-semibold">BAZMA Express</span>. All Rights Reserved.
              </p>

              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-red-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-red-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-red-600 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-red-500/50 hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Back to top"
        >
          <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </footer>
    </>
  );
}