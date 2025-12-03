'use client';

import { useState } from 'react';
import { Star, MessageCircle, User, Plus, X, Loader2 } from 'lucide-react';

export default function TestimonialSection({ initialData }: { initialData: any[] }) {
    const [reviews, setReviews] = useState(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        nama: '',
        pekerjaan: '',
        rating: 5,
        komentar: ''
    });

    // Hitung Statistik Rating (Ala Tokopedia)
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    // Hitung jumlah per bintang
    const starCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percent: totalReviews > 0 ? (reviews.filter(r => r.rating === star).length / totalReviews) * 100 : 0
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/testimoni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setReviews([data, ...reviews]);
                setIsModalOpen(false);
                setFormData({ nama: '', pekerjaan: '', rating: 5, komentar: '' });
                alert('Ulasan berhasil dikirim!');
            } else {
                // Tampilkan pesan error dari backend (misal kena filter kata kasar)
                alert(data.error || 'Gagal mengirim ulasan.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20 bg-white overflow-hidden" id="review">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Ulasan Pelanggan</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Apa Kata Mereka?</h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* BAGIAN KIRI: RINGKASAN RATING (STYLE OLSHOP) */}
                    <div className="w-full lg:w-1/3 bg-slate-50 p-8 rounded-2xl border border-slate-100 h-fit sticky top-24">
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-6xl font-bold text-slate-900">{averageRating}</span>
                            <span className="text-lg text-slate-500 mb-2">/ 5.0</span>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={24} fill={i < Math.round(Number(averageRating)) ? "#facc15" : "#e2e8f0"} className={i < Math.round(Number(averageRating)) ? "text-yellow-400" : "text-gray-200"} />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mb-8">{totalReviews} Ulasan Total</p>

                        {/* Grafik Batang Bintang */}
                        <div className="space-y-3">
                            {starCounts.map((item) => (
                                <div key={item.star} className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1 w-12 text-slate-600 font-bold">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" /> {item.star}
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${item.percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-8 text-right text-slate-400 text-xs">{item.count}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <p className="text-slate-600 mb-4 text-sm font-medium">Bagikan pengalaman Anda:</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                            >
                                <Plus size={20} /> Tulis Ulasan
                            </button>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: LIST REVIEW */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500">Belum ada ulasan. Jadilah yang pertama!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                                {review.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-900 text-sm">{review.nama}</h5>
                                                <p className="text-xs text-slate-500">{review.pekerjaan || 'Pelanggan'}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="flex gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? "#facc15" : "#e2e8f0"} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        {review.komentar}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL FORM REVIEW (Tetap Sama seperti sebelumnya, hanya memastikan text hitam) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">Tulis Pengalaman Anda</h3>
                        <p className="text-sm text-gray-500 mb-6">Masukan Anda sangat berarti bagi kami.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-center gap-2 py-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition transform hover:scale-110"
                                    >
                                        <Star
                                            size={32}
                                            className={star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-100"}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-xs text-gray-400 font-medium">Pilih Bintang</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                    placeholder="Masukkan nama anda"
                                    value={formData.nama}
                                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Karyawan / Ibu Rumah Tangga"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                    value={formData.pekerjaan}
                                    onChange={e => setFormData({ ...formData, pekerjaan: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Ceritakan pengalaman anda..."
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                                    value={formData.komentar}
                                    onChange={e => setFormData({ ...formData, komentar: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Kirim Ulasan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}