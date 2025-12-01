'use client';

import { useState } from 'react';
import { Star, MessageCircle, Truck, Store, X, MapPin } from 'lucide-react';

interface Product {
    id: number;
    nama: string;
    deskripsi: string | null;
    harga: number; // Disini number karena sudah dikonversi dari Decimal di page.tsx
    gambarUrl: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Nomor WA Admin
    const whatsappNumber = "6281367995046";

    const handleOrder = (type: 'delivery' | 'pickup') => {
        let message = '';

        if (type === 'delivery') {
            message = `Halo Nazarel Qua, saya ingin memesan *${product.nama}* (Refill). \n\nMohon *DIANTAR* ke alamat saya.`;
        } else {
            message = `Halo Nazarel Qua, saya ingin memesan *${product.nama}* (Refill). \n\nSaya akan *JEMPUT* (Ambil Sendiri) ke depot.`;
        }

        const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(link, '_blank');
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col relative">
                {/* Badge Promo */}
                <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    ISI ULANG
                </div>

                {/* Gambar */}
                <div className="h-64 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    {product.gambarUrl ? (
                        <img
                            src={product.gambarUrl}
                            alt={product.nama}
                            className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                        />
                    ) : (
                        <div className="text-center opacity-30">
                            <span className="text-blue-400 font-bold text-lg">Nazarel Qua</span>
                        </div>
                    )}

                    {/* Overlay Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300"
                        >
                            Pesan Sekarang
                        </button>
                    </div>
                </div>

                {/* Konten */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">{product.nama}</h3>
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded">
                            <Star size={12} fill="currentColor" /> 5.0
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                        {product.deskripsi || 'Air minum murni berkualitas tinggi.'}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Harga Refill</p>
                            <p className="text-2xl font-bold text-blue-600">Rp {product.harga.toLocaleString('id-ID')}</p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group-active:scale-95"
                        >
                            <MessageCircle size={20} /> <span className="font-semibold text-sm">Pesan</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL PILIHAN PEMESANAN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative transform transition-all scale-100">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Metode Pemesanan</h3>
                        <p className="text-center text-gray-500 text-sm mb-6">
                            Ingin galon diantar ke rumah atau Anda jemput sendiri ke depot?
                        </p>

                        <div className="space-y-3">
                            {/* Opsi 1: Delivery */}
                            <button
                                onClick={() => handleOrder('delivery')}
                                className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-500 transition group text-left"
                            >
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700">Diantar ke Rumah</h4>
                                    <p className="text-xs text-gray-500">Kurir kami akan mengantar ke lokasi Anda.</p>
                                </div>
                            </button>

                            {/* Opsi 2: Pickup */}
                            <button
                                onClick={() => handleOrder('pickup')}
                                className="w-full flex items-center gap-4 p-4 border rounded-xl hover:bg-green-50 hover:border-green-500 transition group text-left"
                            >
                                <div className="bg-green-100 text-green-600 p-3 rounded-full group-hover:bg-green-600 group-hover:text-white transition">
                                    <Store size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-green-700">Jemput di Depot</h4>
                                    <p className="text-xs text-gray-500">Datang langsung ke lokasi Nazarel Qua.</p>
                                </div>
                            </button>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-400">
                            Pemesanan akan diarahkan ke WhatsApp
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}