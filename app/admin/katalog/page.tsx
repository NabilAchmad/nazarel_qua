'use client';
import { useState, useEffect } from 'react';
import { UploadCloud, X, Edit, Trash2, Image as ImageIcon, Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Katalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form & UI States
    const [formData, setFormData] = useState({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
    const [editId, setEditId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = () => fetch('/api/produk').then(r => r.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setIsUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            if (!res.ok) throw new Error("Upload failed");
            const result = await res.json();
            setFormData(prev => ({ ...prev, gambarUrl: result.url }));
        } catch (error) {
            alert("Gagal upload gambar. Cek koneksi atau ukuran file.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const url = editId ? `/api/produk/${editId}` : '/api/produk';
        const method = editId ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            closeModal();
            fetchProducts();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus produk ini permanen?")) return;
        await fetch(`/api/produk/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const openEdit = (p: any) => {
        setEditId(p.id);
        setFormData({ nama: p.nama, deskripsi: p.deskripsi || '', harga: p.harga, gambarUrl: p.gambarUrl || '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ nama: '', deskripsi: '', harga: 0, gambarUrl: '' });
        setIsUploading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Katalog Produk</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola daftar produk yang tampil di halaman depan.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-ocean-600/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> Tambah Produk
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold text-sm">
                            <tr>
                                <th className="p-5 w-24">Foto</th>
                                <th className="p-5">Nama Produk</th>
                                <th className="p-5">Harga</th>
                                <th className="p-5">Deskripsi</th>
                                <th className="p-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                                <Package size={32} />
                                            </div>
                                            <p className="font-medium">Belum ada data produk.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5">
                                            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                                                {p.gambarUrl ? (
                                                    <img src={p.gambarUrl} alt={p.nama} className="w-full h-full object-cover" />
                                                ) : <ImageIcon className="text-slate-300" size={24} />}
                                            </div>
                                        </td>
                                        <td className="p-5 font-bold text-slate-800">{p.nama}</td>
                                        <td className="p-5 text-ocean-600 font-bold bg-ocean-50/30">Rp {p.harga.toLocaleString('id-ID')}</td>
                                        <td className="p-5 text-slate-500 max-w-xs truncate">{p.deskripsi || '-'}</td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(p)} className="p-2 text-gold-600 hover:text-gold-700 hover:bg-gold-50 rounded-lg transition" title="Edit">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus">
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-ocean-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative border border-slate-100"
                    >
                        <button onClick={closeModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full"><X size={20} /></button>
                        <h2 className="text-2xl font-extrabold mb-6 text-slate-800">{editId ? 'Edit Produk' : 'Produk Baru'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Produk</label>
                                <input required type="text" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 outline-none transition bg-slate-50 focus:bg-white"
                                    value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} placeholder="Cth: Galon Normal" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga (Rp)</label>
                                <input required type="number" min="0" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 outline-none transition bg-slate-50 focus:bg-white"
                                    value={formData.harga || ''} onChange={e => setFormData({ ...formData, harga: parseFloat(e.target.value) })} placeholder="5000" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                                <textarea rows={3} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 outline-none transition bg-slate-50 focus:bg-white resize-none"
                                    value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Tambahkan keterangan produk..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Foto Produk</label>
                                <div className="flex items-center gap-4">
                                    <label className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition ${isUploading ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-ocean-50/50 hover:bg-ocean-50 border-ocean-200 hover:border-ocean-300 text-ocean-600'}`}>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        <UploadCloud size={18} /> 
                                        <span className="text-sm font-medium">{isUploading ? 'Mengunggah...' : 'Pilih File Gambar'}</span>
                                    </label>
                                    {formData.gambarUrl && (
                                        <div className="h-14 w-14 relative rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                                            <img src={formData.gambarUrl} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">Batal</button>
                                <button type="submit" disabled={isUploading || isLoading} className="px-5 py-2.5 bg-gold-500 text-ocean-950 font-bold rounded-xl hover:bg-gold-400 disabled:opacity-50 transition-all active:scale-95 shadow-sm shadow-gold-500/20">
                                    {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}