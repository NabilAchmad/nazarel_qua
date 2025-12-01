'use client';
import { useState, useEffect } from 'react';
import { Trash2, Star, User } from 'lucide-react';

export default function AdminTestimoni() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data dengan mode=admin agar dapat semua data
    const fetchReviews = () => {
        setLoading(true);
        fetch('/api/testimoni?mode=admin')
            .then(r => r.json())
            .then(data => {
                setReviews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?")) return;

        try {
            const res = await fetch(`/api/testimoni/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchReviews(); // Refresh data
            } else {
                alert("Gagal menghapus data.");
            }
        } catch (error) {
            alert("Terjadi kesalahan koneksi.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Testimoni</h1>
                    <p className="text-gray-500 text-sm">Kelola ulasan yang masuk dari pelanggan.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Total: {reviews.length} Ulasan
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Pelanggan</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Komentar</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                            ) : reviews.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada ulasan masuk.</td></tr>
                            ) : (
                                reviews.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-500 whitespace-nowrap">
                                            {new Date(r.createdAt).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {r.nama.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{r.nama}</p>
                                                    <p className="text-xs text-gray-500">{r.pekerjaan || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={i < r.rating ? "currentColor" : "none"}
                                                        className={i < r.rating ? "text-yellow-400" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 italic max-w-md">
                                            "{r.komentar}"
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                                title="Hapus Testimoni"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}