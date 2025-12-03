'use client';
import { useState, useEffect } from 'react';
import { Trash2, Star, ShieldAlert, MessageSquare, Plus, X } from 'lucide-react';

export default function AdminTestimoni() {
    const [activeTab, setActiveTab] = useState<'reviews' | 'blacklist'>('reviews');

    // State Reviews
    const [reviews, setReviews] = useState<any[]>([]);

    // State Blacklist
    const [blacklist, setBlacklist] = useState<any[]>([]);
    const [newWord, setNewWord] = useState('');

    useEffect(() => {
        fetchReviews();
        fetchBlacklist();
    }, []);

    const fetchReviews = () => fetch('/api/testimoni?mode=admin').then(r => r.json()).then(setReviews);
    const fetchBlacklist = () => fetch('/api/admin/blacklist').then(r => r.json()).then(setBlacklist);

    const handleDeleteReview = async (id: number) => {
        if (!confirm("Hapus ulasan ini?")) return;
        await fetch(`/api/testimoni/${id}`, { method: 'DELETE' });
        fetchReviews();
    };

    const handleAddWord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWord.trim()) return;

        const res = await fetch('/api/admin/blacklist', {
            method: 'POST',
            body: JSON.stringify({ word: newWord })
        });

        if (res.ok) {
            setNewWord('');
            fetchBlacklist();
        } else {
            alert("Gagal menambah kata (mungkin sudah ada)");
        }
    };

    const handleDeleteWord = async (id: number) => {
        if (!confirm("Hapus kata ini dari filter?")) return;
        await fetch(`/api/admin/blacklist?id=${id}`, { method: 'DELETE' });
        fetchBlacklist();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Ulasan & Moderasi</h1>
                    <p className="text-gray-500 text-sm">Kelola testimoni dan filter kata-kata yang tidak pantas.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                    <MessageSquare size={18} /> Daftar Ulasan
                </button>
                <button
                    onClick={() => setActiveTab('blacklist')}
                    className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'blacklist' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500'}`}
                >
                    <ShieldAlert size={18} /> Filter Kata Kasar
                </button>
            </div>

            {/* KONTEN TAB: REVIEWS */}
            {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-600">Pelanggan</th>
                                <th className="p-4 text-sm font-bold text-gray-600">Rating</th>
                                <th className="p-4 text-sm font-bold text-gray-600">Komentar</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(r => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{r.nama}</td>
                                    <td className="p-4 flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-gray-300"} />)}
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">"{r.komentar}"</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteReview(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* KONTEN TAB: BLACKLIST */}
            {activeTab === 'blacklist' && (
                <div className="space-y-6">
                    {/* Form Tambah */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Tambah Kata Terlarang</h3>
                        <form onSubmit={handleAddWord} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Masukkan kata kasar..."
                                className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                value={newWord}
                                onChange={e => setNewWord(e.target.value)}
                            />
                            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center gap-2">
                                <Plus size={18} /> Tambah
                            </button>
                        </form>
                        <p className="text-xs text-gray-400 mt-2">*Komentar yang mengandung kata ini akan otomatis ditolak oleh sistem.</p>
                    </div>

                    {/* Daftar Kata */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Daftar Kata Disensor ({blacklist.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {blacklist.map(item => (
                                <div key={item.id} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-red-100">
                                    {item.word}
                                    <button onClick={() => handleDeleteWord(item.id)} className="hover:text-red-900"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}