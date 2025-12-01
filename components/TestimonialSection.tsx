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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/testimoni', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newReview = await res.json();
                // Update UI langsung tanpa reload
                setReviews([newReview, ...reviews]);
                setIsModalOpen(false);
                setFormData({ nama: '', pekerjaan: '', rating: 5, komentar: '' });
                alert('Terima kasih atas ulasan Anda!');
            } else {
                alert('Gagal mengirim ulasan.');
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
                <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                    <div className="w-full md:w-1/3">
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Testimoni</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">Kata Mereka Tentang Nazarel Qua</h2>
                        <p className="text-slate-600 text-lg mb-8">
                            Kepuasan pelanggan adalah prioritas kami. Ceritakan pengalaman kesegaran Anda bersama kami.
                        </p>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200"
                        >
                            <Plus size={20} /> Tulis Ulasan
                        </button>
                    </div>

                    <div className="w-full md:w-2/3">
                        {reviews.length === 0 ? (
                            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed">
                                <p className="text-gray-500">Belum ada ulasan. Jadilah yang pertama mereview!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.slice(0, 4).map((review) => (
                                    <div key={review.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative hover:shadow-md transition">
                                        <div className="flex gap-1 text-yellow-400 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <p className="text-slate-600 italic mb-6 relative z-10 text-sm">"{review.komentar}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                                {review.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-900 text-sm">{review.nama}</h5>
                                                <p className="text-xs text-slate-500">{review.pekerjaan || 'Pelanggan'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL FORM REVIEW */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-gray-800 mb-1">Tulis Pengalaman Anda</h3>
                        <p className="text-sm text-gray-500 mb-6">Masukan Anda sangat berarti bagi kami.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Rating Input */}
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
                                <input required type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan (Opsional)</label>
                                <input type="text" placeholder="Contoh: Karyawan / Ibu Rumah Tangga" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.pekerjaan} onChange={e => setFormData({ ...formData, pekerjaan: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                                <textarea required rows={3} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.komentar} onChange={e => setFormData({ ...formData, komentar: e.target.value })} />
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