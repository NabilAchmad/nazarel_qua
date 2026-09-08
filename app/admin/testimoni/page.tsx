'use client';
import { useState, useEffect } from 'react';
import { Trash2, Star, ShieldAlert, MessageSquare, Plus, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ulasan & Moderasi</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola testimoni pelanggan dan filter kata-kata yang tidak pantas.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'reviews' ? 'border-ocean-600 text-ocean-700' : 'border-transparent text-slate-500 hover:text-ocean-600'}`}
                >
                    <MessageSquare size={18} /> Daftar Ulasan
                </button>
                <button
                    onClick={() => setActiveTab('blacklist')}
                    className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'blacklist' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-rose-500'}`}
                >
                    <ShieldAlert size={18} /> Filter Kata Kasar
                </button>
            </div>

            {/* KONTEN TAB: REVIEWS */}
            {activeTab === 'reviews' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                                <tr>
                                    <th className="p-5">Pelanggan</th>
                                    <th className="p-5">Rating</th>
                                    <th className="p-5">Komentar</th>
                                    <th className="p-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-16 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                                    <Search size={32} />
                                                </div>
                                                <p className="font-medium">Belum ada ulasan dari pelanggan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map(r => (
                                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5 font-bold text-slate-800 whitespace-nowrap">{r.nama}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-1 text-gold-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-gold-500" : "text-slate-200"} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-5 text-slate-600 font-medium italic">"{r.komentar}"</td>
                                            <td className="p-5 text-center">
                                                <div className="flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleDeleteReview(r.id)} className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* KONTEN TAB: BLACKLIST */}
            {activeTab === 'blacklist' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* Form Tambah */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-extrabold text-slate-800 mb-4 text-lg">Tambah Kata Terlarang</h3>
                        <form onSubmit={handleAddWord} className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Masukkan kata kasar untuk diblokir..."
                                className="flex-1 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition bg-slate-50 focus:bg-white text-slate-700"
                                value={newWord}
                                onChange={e => setNewWord(e.target.value)}
                            />
                            <button type="submit" className="bg-rose-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-rose-600 flex items-center gap-2 transition-all active:scale-95 shadow-sm shadow-rose-500/20">
                                <Plus size={18} /> Tambah
                            </button>
                        </form>
                        <p className="text-sm font-medium text-slate-400 mt-3 flex items-center gap-2">
                            <ShieldAlert size={14} className="text-rose-400" />
                            Komentar yang mengandung kata ini akan otomatis ditolak oleh sistem.
                        </p>
                    </div>

                    {/* Daftar Kata */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-extrabold text-slate-800 mb-6 text-lg">Daftar Kata Disensor <span className="text-rose-500">({blacklist.length})</span></h3>
                        <div className="flex flex-wrap gap-3">
                            {blacklist.length === 0 ? (
                                <p className="text-slate-400 text-sm font-medium">Belum ada kata yang dimasukkan ke dalam blacklist.</p>
                            ) : (
                                blacklist.map(item => (
                                    <div key={item.id} className="bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-rose-100 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                                        {item.word}
                                        <button onClick={() => handleDeleteWord(item.id)} className="hover:text-rose-900 bg-rose-200/50 hover:bg-rose-200 p-1 rounded-full transition"><X size={14} /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}