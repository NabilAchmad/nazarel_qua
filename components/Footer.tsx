// components/Footer.tsx
'use client';

export default function Footer() {
    return (
        <footer className="bg-ocean-950 text-ocean-200 py-16 mt-auto border-t border-ocean-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-extrabold text-white mb-4">Nazarel<span className="text-gold-500">.</span></h3>
                        <p className="text-ocean-300 mb-6 leading-relaxed">
                            Pusat air minum higienis dengan teknologi Bio-Energy & UV Sterilization. Kualitas premium untuk keluarga Anda.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-bold text-white mb-4">Tautan Cepat</h4>
                        <ul className="space-y-3 font-medium text-ocean-300">
                            <li><a href="#home" className="hover:text-gold-400 transition">Beranda</a></li>
                            <li><a href="#katalog" className="hover:text-gold-400 transition">Katalog Produk</a></li>
                            <li><a href="#tentang-kami" className="hover:text-gold-400 transition">Lokasi & Tentang Kami</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-bold text-white mb-4">Hubungi Kami</h4>
                        <ul className="space-y-3 font-medium text-ocean-300">
                            <li className="leading-snug">📍 Maur Baru, Kec. Rupit, Musi Rawas Utara, Sumatera Selatan</li>
                            <li>📞 WhatsApp / Telepon</li>
                            <li>✉️ cs@nazarelqua.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-ocean-800/60 pt-8 text-sm flex flex-col items-center">
                    <p className="text-ocean-400 mb-4">© {new Date().getFullYear()} Depot Air Minum Nazarel Qua. All rights reserved.</p>
                    
                    {/* Badge Proyek Akademik */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-ocean-900 rounded-full border border-ocean-700 text-xs text-ocean-300 shadow-inner">
                        <span className="font-medium text-gold-500">Proyek UAS Topik Khusus</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-ocean-600"></span>
                        <span className="flex items-center gap-1.5">
                            Powered by <span className="text-green-400 font-bold">MongoDB</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}