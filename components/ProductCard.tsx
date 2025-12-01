'use client';

import { useState } from 'react';
import { Star, MessageCircle, Truck, Store, X, MapPin, User, ChevronRight } from 'lucide-react';

interface Product {
    id: number;
    nama: string;
    deskripsi: string | null;
    harga: number;
    gambarUrl: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Form Pemesanan
    const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery'); // Default 'delivery'
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    // Nomor WA Admin
    const whatsappNumber = "6281367995046";

    const handleSendOrder = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi sederhana
        if (!name.trim()) {
            alert("Mohon isi nama Anda.");
            return;
        }
        if (method === 'delivery' && !address.trim()) {
            alert("Mohon isi alamat pengantaran.");
            return;
        }

        // Format Pesan WhatsApp yang Rapi
        let message = `Halo Nazarel Qua, saya ingin memesan: \n\n`;
        message += `🛍️ *Produk:* ${product.nama}\n`;
        message += `💰 *Harga:* Rp ${product.harga.toLocaleString('id-ID')}\n`;
        message += `--------------------------------\n`;
        message += `👤 *Nama:* ${name}\n`;
        message += `🚚 *Metode:* ${method === 'delivery' ? 'DIANTAR KE RUMAH' : 'AMBIL SENDIRI (PICKUP)'}\n`;

        if (method === 'delivery') {
            message += `📍 *Alamat:* ${address}\n`;
        }

        message += `\nMohon segera diproses ya, Terima kasih!`;

        // Buka WhatsApp
        const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(link, '_blank');

        // Reset & Tutup
        setIsModalOpen(false);
        setName('');
        setAddress('');
    };

    return (
        <>
            {/* --- KARTU PRODUK (Tampilan Luar) --- */}
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

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300"
                        >
                            Pesan Sekarang
                        </button>
                    </div>
                </div>

                {/* Konten Bawah */}
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

            {/* --- MODAL FORMULIR PEMESANAN (Pop-up) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col max-h-[90vh] overflow-y-auto">

                        {/* Header Modal */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-gray-800">Detail Pemesanan</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body Form */}
                        <div className="p-6">
                            <form onSubmit={handleSendOrder} className="space-y-5">

                                {/* Pilihan Metode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pengambilan</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setMethod('delivery')}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition ${method === 'delivery'
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 text-gray-500 hover:border-blue-200'
                                                }`}
                                        >
                                            <Truck size={24} />
                                            <span className="text-xs font-bold">Diantar (COD)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMethod('pickup')}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition ${method === 'pickup'
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-200 text-gray-500 hover:border-green-200'
                                                }`}
                                        >
                                            <Store size={24} />
                                            <span className="text-xs font-bold">Ambil Sendiri</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Input Nama (Wajib) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemesan <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Masukkan nama Anda"
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Input Alamat (Hanya jika Delivery) */}
                                {method === 'delivery' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                                                <MapPin size={18} />
                                            </div>
                                            <textarea
                                                required
                                                rows={3}
                                                placeholder="Contoh: Jl. Mawar No. 12, Samping Masjid Al-Hidayah"
                                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Ringkasan & Tombol */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>Lanjut ke WhatsApp</span>
                                        <ChevronRight size={20} />
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-3">
                                        Pesanan Anda akan diteruskan ke Admin via WhatsApp.
                                    </p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}